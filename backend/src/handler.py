import json
from datetime import datetime
from decimal import Decimal

from agent.future_news_agent import (
    run_future_news_agent
)

from agent.memory import (
    update_world_memory
)

from services.dynamodb_service import (
    get_world_state,
    get_all_editions,
    get_latest_edition,
    get_edition_by_id,
    save_edition,
    update_world_state
)


CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
}


def decimal_serializer(value):
    """
    JSON default= hook for values json.dumps can't
    natively handle, notably the Decimal objects
    DynamoDB returns for all numeric attributes.

    Integral Decimals (e.g. Decimal("182")) become int,
    non-integral Decimals become float.
    """

    if isinstance(value, Decimal):
        if value % 1 == 0:
            return int(value)
        return float(value)

    return str(value)


def response(
    status_code: int,
    body: dict
) -> dict:
    """
    Build an API Gateway HTTP API response
    with CORS headers attached.
    """

    return {
        "statusCode": status_code,
        "headers": CORS_HEADERS,
        "body": json.dumps(
            body,
            default=decimal_serializer
        )
    }


def get_request_path(event: dict) -> str:
    """
    Resolve the request path from an API Gateway
    HTTP API (payload format 2.0) event, with fallbacks
    for other event shapes.
    """

    request_context = event.get(
        "requestContext",
        {}
    )

    http_context = request_context.get(
        "http",
        {}
    )

    return (
        http_context.get("path")
        or event.get("rawPath")
        or event.get("path")
        or ""
    )


def get_request_method(event: dict) -> str:
    request_context = event.get(
        "requestContext",
        {}
    )

    http_context = request_context.get(
        "http",
        {}
    )

    return (
        http_context.get("method")
        or event.get("httpMethod")
        or "GET"
    )


def create_edition(
    event: dict,
    article: str,
    edition_number: int
) -> dict:
    """
    Convert an approved event and generated article
    into a FutureNews edition.
    """

    edition_id = (
        f"edition-{edition_number:03d}"
    )

    return {
        "editionId": edition_id,
        "editionNumber": edition_number,
        "futureDate": event.get(
            "eventDate"
        ),
        "headline": event.get(
            "headline"
        ),
        "category": event.get(
            "eventType",
            "Future News"
        ),
        "breakingSummary": event.get(
            "summary"
        ),
        "article": article,
        "backgroundContext": event.get(
            "storylineImpact"
        ),
        "relatedEvents": [],
        "newFacts": event.get(
            "newFacts",
            []
        ),
        "possibleFutureDevelopments": event.get(
            "possibleFutureDevelopments",
            []
        ),
        "createdAt": (
            datetime.utcnow()
            .replace(microsecond=0)
            .isoformat()
            + "Z"
        )
    }


def get_latest_edition_route() -> dict:
    """
    GET /latest

    Never calls Bedrock. Reads the latest edition
    straight from DynamoDB.
    """

    try:
        edition = get_latest_edition()
    except Exception as error:
        return response(
            500,
            {"error": str(error)}
        )

    if not edition:
        return response(
            404,
            {"error": "No editions found."}
        )

    return response(
        200,
        edition
    )


def get_all_editions_route() -> dict:
    """
    GET /editions

    Never calls Bedrock. Reads every edition
    straight from DynamoDB.
    """

    try:
        editions = get_all_editions()
    except Exception as error:
        return response(
            500,
            {"error": str(error)}
        )

    return response(
        200,
        {"editions": editions}
    )


def get_edition_by_id_route(edition_id: str) -> dict:
    """
    GET /editions/{editionId}

    Never calls Bedrock. Reads a single edition
    straight from DynamoDB.
    """

    try:
        edition = get_edition_by_id(edition_id)
    except Exception as error:
        return response(
            500,
            {"error": str(error)}
        )

    if not edition:
        return response(
            404,
            {"error": f"Edition '{edition_id}' not found."}
        )

    return response(
        200,
        edition
    )


def generate_future_news() -> dict:
    """
    GET /generate

    The ONLY route allowed to:
    1. Load persistent world memory
    2. Load previous editions
    3. Run autonomous FutureNews agent (calls Bedrock)
    4. Create a full newspaper edition
    5. Update persistent world memory
    6. Save edition and memory
    """

    try:

        # -----------------------------
        # STEP 1: LOAD MEMORY
        # -----------------------------

        world_state = get_world_state()

        if not world_state:
            return response(
                404,
                {
                    "error": (
                        "World state not found."
                    )
                }
            )

        editions = get_all_editions()

        # -----------------------------
        # STEP 2: RUN AGENT
        # -----------------------------

        agent_result = run_future_news_agent(
            world_state,
            editions
        )

        generated_event = agent_result[
            "event"
        ]

        # -----------------------------
        # STEP 3: CREATE EDITION
        # -----------------------------

        next_edition_number = (
            int(
                world_state.get(
                    "totalEditions",
                    0
                )
            )
            + 1
        )

        edition = create_edition(
            event=generated_event,
            article=agent_result["article"],
            edition_number=next_edition_number
        )

        # -----------------------------
        # STEP 4: UPDATE MEMORY
        # -----------------------------

        updated_world_state = (
            update_world_memory(
                world_state=world_state,
                new_facts=generated_event.get(
                    "newFacts",
                    []
                ),
                updated_storylines=world_state.get(
                    "activeStorylines",
                    []
                ),
                new_entities={},
                new_future_date=generated_event.get(
                    "eventDate"
                ),
                new_edition_id=edition[
                    "editionId"
                ],
                storyline_impact=generated_event.get(
                    "storylineImpact",
                    ""
                )
            )
        )

        # -----------------------------
        # STEP 5: SAVE TO DYNAMODB
        # -----------------------------

        save_edition(
            edition
        )

        update_world_state(
            updated_world_state
        )

        # -----------------------------
        # STEP 6: RETURN RESULT
        # -----------------------------

        return response(
            200,
            {
                "message": (
                    "FutureNews edition "
                    "generated successfully."
                ),
                "edition": edition,
                "agentReview": agent_result[
                    "review"
                ],
                "dateValidation": agent_result[
                    "dateValidation"
                ],
                "wasRevised": agent_result[
                    "wasRevised"
                ]
            }
        )

    except Exception as error:

        return response(
            500,
            {"error": str(error)}
        )


def lambda_handler(
    event,
    context
):
    """
    Main entry point for FutureNews AI.

    Routes each API Gateway HTTP API request to the
    correct handler based on its path. Only GET /generate
    is allowed to invoke Amazon Bedrock / the agent.
    """

    method = get_request_method(event)

    if method == "OPTIONS":
        return response(200, {})

    path = get_request_path(event)

    if path.startswith("/prod/"):
        path = path[len("/prod"):]
    elif path == "/prod":
        path = "/"

    if path == "/latest":
        return get_latest_edition_route()

    if path == "/editions":
        return get_all_editions_route()

    if path.startswith("/editions/"):
        edition_id = path[len("/editions/"):].strip("/")
        return get_edition_by_id_route(edition_id)

    if path == "/generate":
        return generate_future_news()

    return response(
        404,
        {"error": f"No route found for '{path}'."}
    )


if __name__ == "__main__":
    result = lambda_handler(
        {
            "requestContext": {
                "http": {
                    "method": "GET",
                    "path": "/generate"
                }
            }
        },
        None
    )

    print(
        json.dumps(
            result,
            indent=2,
            default=str
        )
    )