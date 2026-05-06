"""Submit a Nano Banana Pro generation, poll, and download.

Usage: python genimg.py <slug> <aspect> <out_path> "<prompt>"
"""
import json
import os
import sys
import time
import urllib.request
import urllib.error

TOKEN_PATH = r"C:/Users/phoen/.claude/skills/generate-image/.token"
ENDPOINT = "https://api.replicate.com/v1/models/google/nano-banana-pro/predictions"


def post(url, body, headers):
    data = json.dumps(body).encode("utf-8") if body is not None else b""
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=180) as r:
        return json.loads(r.read().decode("utf-8"))


def get(url, headers):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode("utf-8"))


def download(url, out_path):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=120) as r:
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "wb") as f:
            while True:
                chunk = r.read(64 * 1024)
                if not chunk:
                    break
                f.write(chunk)


def main():
    slug, aspect, out_path, prompt = sys.argv[1:5]
    with open(TOKEN_PATH, encoding="utf-8") as f:
        token = f.read().strip()

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Prefer": "wait=60",
    }
    body = {
        "input": {
            "prompt": prompt,
            "aspect_ratio": aspect,
            "resolution": "2K",
            "output_format": "jpg",
            "safety_filter_level": "block_only_high",
            "allow_fallback_model": True,
        }
    }

    try:
        resp = post(ENDPOINT, body, headers)
    except urllib.error.HTTPError as e:
        print(f"[{slug}] HTTPError: {e.code} {e.read().decode('utf-8')}", file=sys.stderr)
        sys.exit(2)

    pred_id = resp.get("id")
    status = resp.get("status")
    output = resp.get("output")

    if not pred_id:
        print(f"[{slug}] No prediction id: {resp}", file=sys.stderr)
        sys.exit(2)

    poll_headers = {"Authorization": f"Bearer {token}"}
    poll_url = f"https://api.replicate.com/v1/predictions/{pred_id}"
    for _ in range(75):  # ~5 min
        if status in ("succeeded", "failed", "canceled"):
            break
        time.sleep(4)
        try:
            r = get(poll_url, poll_headers)
        except Exception as e:  # noqa
            print(f"[{slug}] poll error: {e}", file=sys.stderr)
            continue
        status = r.get("status")
        output = r.get("output")
        if status in ("succeeded", "failed", "canceled"):
            break

    if status != "succeeded":
        print(f"[{slug}] FAILED status={status} out={output} resp_err={r.get('error') if 'r' in dir() else ''}", file=sys.stderr)
        sys.exit(2)

    if isinstance(output, list):
        output = output[0]
    if not output:
        print(f"[{slug}] No output URL", file=sys.stderr)
        sys.exit(2)

    download(output, out_path)
    print(f"[{slug}] saved {out_path}")


if __name__ == "__main__":
    main()
