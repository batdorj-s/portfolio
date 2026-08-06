#!/usr/bin/env bash
# Compress a video for web: WebM (VP9) + MP4 (H.264) + poster JPG
# Usage: ./scripts/compress-videos.sh <input.mov> <output-name> <output-dir>
# Example: ./scripts/compress-videos.sh ~/Videos/1.mov 1 public/videos

set -euo pipefail

INPUT="$1"
NAME="$2"
OUT_DIR="$3"

mkdir -p "$OUT_DIR"

echo "==> [${NAME}] MP4 (H.264)"
ffmpeg -y -i "$INPUT" \
  -vf "scale='min(1920,iw)':-2" \
  -r 30 \
  -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -profile:v high \
  -movflags +faststart \
  -c:a aac -b:a 128k -ac 2 \
  "$OUT_DIR/${NAME}.mp4"

echo "==> [${NAME}] WebM (VP9)"
ffmpeg -y -i "$INPUT" \
  -vf "scale='min(1920,iw)':-2" \
  -r 30 \
  -c:v libvpx-vp9 -crf 33 -b:v 0 -cpu-used 2 -row-mt 1 \
  -c:a libopus -b:a 96k -ac 2 \
  "$OUT_DIR/${NAME}.webm"

echo "==> [${NAME}] Poster"
ffmpeg -y -i "$INPUT" \
  -vf "scale='min(1280,iw)':-2" \
  -frames:v 1 -q:v 4 \
  "$OUT_DIR/${NAME}-poster.jpg"

echo "==> [${NAME}] Done"
