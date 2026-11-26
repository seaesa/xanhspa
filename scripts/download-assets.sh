#!/usr/bin/env bash
# Tải ảnh/video/icon từ xanhspa.vn về thư mục project (giữ nguyên cấu trúc đường dẫn)
set -e
BASE="https://xanhspa.vn"
cd "$(dirname "$0")/.."
FILES=(
  favicon.ico favicon-32x32.png apple-touch-icon.png xanh-wellness-logo.png
  photos/hero.jpg photos/pattern-bg.jpg photos/pod-evening.jpg photos/footbath.jpg photos/reception-day.jpg
  photos/founder-tuan-anh.jpg photos/founder-thanh-tuan.jpg photos/founder-trung-kien.jpg
  photos/helpspa/wow-result-poster-v1.jpg photos/helpspa/wow-result-v1.mp4
  photos/helpspa/omron-scale.jpg photos/helpspa/reception-1.jpg photos/helpspa/foot-bath.jpg photos/helpspa/herbal-tea.jpg
  photos/helpspa/cabin-pod.jpg photos/helpspa/omron-scale-2.jpg photos/helpspa/reception-2.jpg photos/helpspa/herbal-drink.jpg
  photos/helpspa/terahertz-field.jpg photos/helpspa/cabin-infrared.jpg photos/helpspa/red-light-mat.jpg
  photos/helpspa/towel-two-green.jpg photos/helpspa/towel-two-brown.jpg photos/helpspa/towel-group-lounge.jpg photos/helpspa/cabin-blue-light.jpg
  photos/helpspa/qr-zalo-tu-van-v2.webp photos/helpspa/qr-nhom-zalo.webp
)
for i in $(seq -w 1 17); do FILES+=("photos/gallery-real/real-$i.webp"); done
printf '%s\n' "${FILES[@]}" | xargs -P 4 -I{} sh -c 'mkdir -p "$(dirname "{}")"; curl -sfL -A "Mozilla/5.0" -o "{}" "'"$BASE"'/{}" || echo "FAIL {}"'
