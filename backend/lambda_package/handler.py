import json
from datetime import datetime

from agent.future_news_agent import (
    run_future_news_agent
)

from agent.memory import (
    update_world_memory
)

from services.dynamodb_service import (
    get_world_state,
    get_all_editions,
    save_edition,
    update_world_state
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


def lambda_handler(
    event,
    context
):
    """
    Main entry point for FutureNews AI.

    Flow:

    1. Load persistent world memory
    2. Load previous editions
    3. Run autonomous FutureNews agent
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
            return {
                "statusCode": 404,
                "body": json.dumps(
                    {
                        "error": (
                            "World state not found."
                        )
                    }
                )
            }

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
            world_state.get(
                "totalEditions",
                0
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

        return {
            "statusCode": 200,
            "body": json.dumps(
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
                },
                default=str
            )
        }

    except Exception as error:

        return {
            "statusCode": 500,
            "body": json.dumps(
                {
                    "error": str(error)
                }
            )
        }


if __name__ == "__main__":
    result = lambda_handler(
        {},
        None
    )

    print(
        json.dumps(
            result,
            indent=2,
            default=str
        )
    )