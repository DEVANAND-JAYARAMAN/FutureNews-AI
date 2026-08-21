import json


def build_event_generation_prompt(
    memory_context: dict
) -> str:
    """
    Build the prompt used to generate the next major
    event in the FutureNews world.
    """

    current_date = memory_context.get(
        "currentFutureDate",
        ""
    )

    world_summary = memory_context.get(
        "worldSummary",
        ""
    )

    important_facts = memory_context.get(
        "importantFacts",
        []
    )

    active_storylines = memory_context.get(
        "activeStorylines",
        []
    )

    recent_editions = memory_context.get(
        "recentEditions",
        []
    )

    prompt = f"""
You are FutureNews AI, an autonomous news agent responsible for
maintaining a persistent fictional future world.

CURRENT FICTIONAL DATE:
{current_date}

WORLD SUMMARY:
{world_summary}

IMPORTANT FACTS:
{json.dumps(important_facts, indent=2)}

ACTIVE STORYLINES:
{json.dumps(active_storylines, indent=2)}

RECENT EDITIONS:
{json.dumps(recent_editions, indent=2)}

Your task is to decide the next major event in this evolving world.

Requirements:

1. The event must be consistent with the current world state.
2. Do not repeat recent events.
3. Continue an existing storyline when it makes sense.
4. You may introduce a new storyline if it naturally follows
   the existing world.
5. The event must occur AFTER the current fictional date.
6. The event must create meaningful consequences for future editions.
7. Be creative, but maintain logical continuity.
8. Use the date format YYYY-MM-DD.

Return ONLY valid JSON in this format:

{{
  "eventType": "",
  "eventDate": "",
  "headline": "",
  "summary": "",
  "storylineImpact": "",
  "newFacts": [],
  "possibleFutureDevelopments": []
}}
"""

    return prompt.strip()


def parse_event_response(
    response_text: str
) -> dict:
    """
    Convert the JSON response from Bedrock
    into a Python dictionary.
    """

    cleaned_response = response_text.strip()

    # Remove Markdown JSON fences if the model adds them
    if cleaned_response.startswith("```json"):
        cleaned_response = cleaned_response.replace(
            "```json",
            "",
            1
        )

    if cleaned_response.startswith("```"):
        cleaned_response = cleaned_response.replace(
            "```",
            "",
            1
        )

    if cleaned_response.endswith("```"):
        cleaned_response = cleaned_response[:-3]

    return json.loads(cleaned_response.strip())


def build_article_generation_prompt(
    memory_context: dict,
    event: dict
) -> str:
    """
    Build a prompt to transform an approved event
    into a complete FutureNews newspaper article.
    """

    return f"""
You are a journalist for FutureNews AI, an autonomous newspaper
reporting from an evolving fictional future.

Write a compelling newspaper article based on the approved event.

CURRENT WORLD CONTEXT:

{json.dumps(memory_context, indent=2)}

APPROVED EVENT:

{json.dumps(event, indent=2)}

Requirements:

1. Write between 500 and 700 words.
2. Use a professional newspaper style.
3. Expand the approved event without contradicting
   established facts.
4. Include wider social, political, technological,
   or economic context where appropriate.
5. Explain why this event matters for the future
   of this fictional world.
6. Do not contradict the approved event.
7. Do not include a headline.
8. Return ONLY the article text.

ARTICLE:
""".strip()