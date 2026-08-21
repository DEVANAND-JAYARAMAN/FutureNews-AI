import boto3


REGION = "ap-south-1"

MODEL_ID = (
    "global.anthropic.claude-sonnet-4-5-20250929-v1:0"
)


bedrock_runtime = boto3.client(
    service_name="bedrock-runtime",
    region_name=REGION
)


def generate_with_bedrock(
    prompt: str,
    max_tokens: int = 2000,
    temperature: float = 0.8
) -> str:
    """
    Send a prompt to Amazon Bedrock using
    Claude Sonnet 4.5 and return the text response.
    """

    response = bedrock_runtime.converse(
        modelId=MODEL_ID,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "text": prompt
                    }
                ]
            }
        ],
        inferenceConfig={
            "maxTokens": max_tokens,
            "temperature": temperature
        }
    )

    return (
        response["output"]["message"]["content"][0]["text"]
    )