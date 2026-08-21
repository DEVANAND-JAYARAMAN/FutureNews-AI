import json

from agent.memory import (
    load_world_memory,
    get_recent_events,
    build_memory_context
)

from agent.generator import (
    build_event_generation_prompt,
    build_article_generation_prompt,
    parse_event_response
)

from agent.reviewer import (
    build_review_prompt,
    validate_event_date,
    parse_review_response,
    should_revise
)

from services.bedrock_service import (
    generate_with_bedrock
)


def generate_event(
    memory_context: dict
) -> dict:
    """
    Generate the next major event
    in the FutureNews world.
    """

    generation_prompt = (
        build_event_generation_prompt(
            memory_context
        )
    )

    response = generate_with_bedrock(
        generation_prompt
    )

    return parse_event_response(
        response
    )


def review_event(
    memory_context: dict,
    generated_event: dict
) -> tuple[dict, dict]:
    """
    Perform deterministic validation
    and AI self-review.
    """

    date_validation = validate_event_date(
        memory_context["currentFutureDate"],
        generated_event.get(
            "eventDate",
            ""
        )
    )

    review_prompt = build_review_prompt(
        memory_context,
        generated_event
    )

    review_response = generate_with_bedrock(
        review_prompt,
        temperature=0.3
    )

    ai_review = parse_review_response(
        review_response
    )

    return date_validation, ai_review


def build_revision_prompt(
    memory_context: dict,
    generated_event: dict,
    date_validation: dict,
    ai_review: dict
) -> str:
    """
    Build a prompt asking the model
    to revise a failed event.
    """

    return f"""
You are FutureNews AI.

A proposed event failed the quality review.

CURRENT WORLD MEMORY:

{json.dumps(memory_context, indent=2)}

PROPOSED EVENT:

{json.dumps(generated_event, indent=2)}

DATE VALIDATION RESULT:

{json.dumps(date_validation, indent=2)}

AI REVIEW RESULT:

{json.dumps(ai_review, indent=2)}

Revise the event using the feedback above.

Requirements:

1. The event date must be after the current fictional date.
2. Do not contradict established facts.
3. Do not repeat recent editions.
4. Continue or logically expand the evolving world.
5. Create meaningful consequences for future editions.
6. Keep the event creative and believable.
7. Use YYYY-MM-DD for eventDate.

Return ONLY valid JSON:

{{
  "eventType": "",
  "eventDate": "",
  "headline": "",
  "summary": "",
  "storylineImpact": "",
  "newFacts": [],
  "possibleFutureDevelopments": []
}}
""".strip()


def revise_event(
    memory_context: dict,
    generated_event: dict,
    date_validation: dict,
    ai_review: dict
) -> dict:
    """
    Ask the model to revise
    a failed event.
    """

    revision_prompt = build_revision_prompt(
        memory_context,
        generated_event,
        date_validation,
        ai_review
    )

    response = generate_with_bedrock(
        revision_prompt,
        temperature=0.6
    )

    return parse_event_response(
        response
    )


def run_future_news_agent(
    world_state: dict,
    editions: list[dict]
) -> dict:
    """
    Main FutureNews AI agent.

    Flow:

    1. Load persistent memory
    2. Build context
    3. Generate event
    4. Validate event
    5. AI self-review
    6. Revise if necessary
    7. Review revised event
    8. Generate newspaper article
    9. Return final result
    """

    # -----------------------------
    # STEP 1: LOAD MEMORY
    # -----------------------------

    memory = load_world_memory(
        world_state
    )

    recent_editions = get_recent_events(
        editions,
        limit=5
    )

    memory_context = build_memory_context(
        memory,
        recent_editions
    )

    # -----------------------------
    # STEP 2: GENERATE EVENT
    # -----------------------------

    generated_event = generate_event(
        memory_context
    )

    # -----------------------------
    # STEP 3: REVIEW EVENT
    # -----------------------------

    date_validation, ai_review = review_event(
        memory_context,
        generated_event
    )

    needs_revision = should_revise(
        date_validation,
        ai_review
    )

    was_revised = False

    # -----------------------------
    # STEP 4: REVISE IF REQUIRED
    # -----------------------------

    if needs_revision:

        was_revised = True

        generated_event = revise_event(
            memory_context,
            generated_event,
            date_validation,
            ai_review
        )

        # Review revised event again
        date_validation, ai_review = review_event(
            memory_context,
            generated_event
        )

    # -----------------------------
    # STEP 5: GENERATE ARTICLE
    # -----------------------------

    article_prompt = (
        build_article_generation_prompt(
            memory_context,
            generated_event
        )
    )

    article = generate_with_bedrock(
        article_prompt,
        max_tokens=2000,
        temperature=0.7
    )

    # -----------------------------
    # STEP 6: RETURN RESULT
    # -----------------------------

    return {
        "event": generated_event,
        "article": article,
        "review": ai_review,
        "dateValidation": date_validation,
        "wasRevised": was_revised
    }