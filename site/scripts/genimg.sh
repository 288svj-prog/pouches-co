#!/bin/bash
# usage: genimg.sh <slug> <aspect_ratio> <output_path> "<prompt>"
TOKEN=$(cat "C:/Users/phoen/.claude/skills/generate-image/.token")
SLUG="$1"
ASPECT="$2"
OUT="$3"
PROMPT="$4"

# Submit prediction
RESP=$(curl -s -X POST https://api.replicate.com/v1/models/google/nano-banana-pro/predictions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Prefer: wait=60" \
  -d "$(jq -n --arg p "$PROMPT" --arg ar "$ASPECT" '{
    input: {
      prompt: $p,
      aspect_ratio: $ar,
      resolution: "2K",
      output_format: "jpg",
      safety_filter_level: "block_only_high",
      allow_fallback_model: true
    }
  }')")

PRED_ID=$(echo "$RESP" | jq -r '.id // empty')
STATUS=$(echo "$RESP" | jq -r '.status // empty')
URL=$(echo "$RESP" | jq -r '.output // empty')

if [ -z "$PRED_ID" ]; then
  echo "[$SLUG] ERROR: $RESP" >&2
  exit 1
fi

# Poll if not done
i=0
while [ "$STATUS" != "succeeded" ] && [ "$STATUS" != "failed" ] && [ "$STATUS" != "canceled" ] && [ $i -lt 60 ]; do
  sleep 4
  RESP=$(curl -s -H "Authorization: Bearer $TOKEN" "https://api.replicate.com/v1/predictions/$PRED_ID")
  STATUS=$(echo "$RESP" | jq -r '.status // empty')
  URL=$(echo "$RESP" | jq -r '.output // empty')
  i=$((i+1))
done

if [ "$STATUS" != "succeeded" ]; then
  ERR=$(echo "$RESP" | jq -r '.error // empty')
  echo "[$SLUG] FAILED ($STATUS): $ERR" >&2
  exit 1
fi

if [ -z "$URL" ] || [ "$URL" = "null" ]; then
  echo "[$SLUG] No output URL" >&2
  exit 1
fi

curl -s -o "$OUT" "$URL"
echo "[$SLUG] saved $OUT"
