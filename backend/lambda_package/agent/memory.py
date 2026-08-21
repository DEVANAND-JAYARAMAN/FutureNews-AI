from copy import deepcopy


def load_world_memory(world_state: dict) -> dict:
    """
    Return a safe copy of the current persistent world state.
    """
    return deepcopy(world_state)


def get_recent_events(
    editions: list[dict],
    limit: int = 5
) -> list[dict]:
    """
    Return the most recent editions for short-term context.
    """
    return editions[-limit:]


def build_memory_context(
    world_state: dict,
    recent_editions: list[dict]
) -> dict:
    """
    Build the structured memory context sent to the agent.
    """

    return {
        "currentFutureDate": world_state.get(
            "currentFutureDate"
        ),
        "worldSummary": world_state.get(
            "worldSummary",
            ""
        ),
        "importantFacts": world_state.get(
            "importantFacts",
            []
        ),
        "activeStorylines": world_state.get(
            "activeStorylines",
            []
        ),
        "entities": world_state.get(
            "entities",
            {}
        ),
        "totalEditions": world_state.get(
            "totalEditions",
            0
        ),
        "recentEditions": recent_editions
    }


def update_world_memory(
    world_state: dict,
    new_facts: list[str],
    updated_storylines: list[dict],
    new_entities: dict,
    new_future_date: str,
    new_edition_id: str,
    storyline_impact: str
) -> dict:
    """
    Update the persistent world memory after a new
    FutureNews edition is approved.
    """

    updated_state = deepcopy(world_state)

    # Update fictional date
    updated_state["currentFutureDate"] = new_future_date

    # Add new facts without duplicates
    if "importantFacts" not in updated_state:
        updated_state["importantFacts"] = []

    for fact in new_facts:
        if fact not in updated_state["importantFacts"]:
            updated_state["importantFacts"].append(fact)

    # Update active storylines
    updated_state["activeStorylines"] = updated_storylines

    # Ensure entities exist
    if "entities" not in updated_state:
        updated_state["entities"] = {}

    # Add newly discovered entities
    for entity_type, values in new_entities.items():

        if entity_type not in updated_state["entities"]:
            updated_state["entities"][entity_type] = []

        for value in values:
            if value not in updated_state["entities"][entity_type]:
                updated_state["entities"][entity_type].append(
                    value
                )

    # Remember the new edition
    if "recentEventIds" not in updated_state:
        updated_state["recentEventIds"] = []

    updated_state["recentEventIds"].append(
        new_edition_id
    )

    # Keep only the latest 10 event IDs
    updated_state["recentEventIds"] = (
        updated_state["recentEventIds"][-10:]
    )

    # Increment edition count
    updated_state["totalEditions"] = (
        updated_state.get("totalEditions", 0) + 1
    )

    # Update world summary
    current_summary = updated_state.get(
        "worldSummary",
        ""
    )

    if storyline_impact:
        updated_state["worldSummary"] = (
            f"{current_summary} "
            f"Latest development: {storyline_impact}"
        ).strip()

    return updated_state