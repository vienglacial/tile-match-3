# 🧩 Tile Match 3 — Game Xếp Hình

Game giải đố ghép 3 ô kiểu Tile Master **kết hợp hệ thống tướng & kỹ năng lấy cảm hứng từ MOBA**, chạy trên web và mobile, không cần cài đặt gì.

## Cách chạy

- **Đơn giản nhất:** mở thẳng file `index.html` bằng trình duyệt (Chrome/Edge/Safari).
- **Chơi trên điện thoại trong cùng mạng Wi-Fi:** chạy một web server tĩnh rồi mở bằng IP máy tính:

```powershell
# trong thư mục game
npx serve .
# hoặc
python -m http.server 8000
```

Sau đó trên điện thoại mở `http://<IP-máy-tính>:8000`.

## Luật chơi

- Chạm vào ô **không bị che** (ô bị che sẽ tối màu) để đưa nó xuống khay.
- **3 ô giống nhau** trong khay sẽ tự biến mất và cộng điểm.
- Khay chỉ chứa tối đa **7 ô** (8 ô nếu chọn Cún Vàng) — đầy khay là thua.
- Xóa hết bàn cờ để qua màn.
- Không có giới hạn thời gian — cứ từ từ suy nghĩ!

## Tướng & Kỹ năng (chất MOBA)

Chọn 1 trong 3 người bạn đồng hành trước khi chơi. Ghép ô để nạp năng lượng kỹ năng:
ô thường +1 ⚡, **ô năng lượng** (viền tím, hiện trên thanh trên cùng) +2 ⚡.

| Tướng | Kỹ năng chủ động | Nội tại |
|-------|------------------|---------|
| 🐱 **Mèo Mun** (4 ⚡) | *Chộp Gọn* — chạm 1 ô bất kỳ (kể cả bị che), cả bộ 3 của nó biến mất | Ghép ô năng lượng được x2 điểm |
| 🦉 **Cú Thông Thái** (3 ⚡) | *Mắt Sáng* — lấy 1 ô đang bị che xuống khay, xuyên mọi tầng | Vào màn có sẵn 2 ⚡ |
| 🐶 **Cún Vàng** (4 ⚡) | *Tha Về* — trả toàn bộ ô trong khay về bàn cờ | Khay rộng 8 ô thay vì 7 |

## Độ khó tăng dần

| Màn | Số loại ô | Số bộ 3 | Số tầng |
|-----|-----------|---------|---------|
| 1   | 5         | 9       | 3       |
| 5   | 7         | 17      | 5       |
| 10  | 9         | 27      | 6       |
| 15+ | 12–16     | tối đa 36 | 6     |

## Trợ giúp (booster)

- ↩️ **Hoàn tác** — trả ô vừa bốc về bàn cờ.
- 🔀 **Xáo trộn** — đổi ngẫu nhiên vị trí các loại ô trên bàn.
- 📤 **Lấy ra 3** — trả 3 ô đầu khay về bàn cờ.

Mỗi màn được cộng thêm 1 lượt mỗi loại (tối đa 5).

## Lưu trữ & Bảng xếp hạng

- Hồ sơ người chơi (điểm cao nhất, màn cao nhất) lưu bằng `localStorage` — tự động giữ khi mở lại.
- Nhiều người chơi trên cùng thiết bị: mỗi người nhập tên riêng.
- Bảng xếp hạng top 20 sắp theo điểm cao nhất, rồi đến màn cao nhất.

## Chế độ nhà phát triển (test)

Mở game với tham số `?dev=1` (ví dụ `index.html?dev=1`) sẽ hiện bảng 🛠 DEV góc trái dưới:

- ✅ **Qua màn** — thắng màn ngay lập tức (chạy đúng luồng thắng thật: cộng thưởng, lưu điểm).
- ⏪ / ⏩ **Màn -1 / +1** — nhảy tới màn bất kỳ để test bố cục và độ khó.
- ♾ **Khay vô hạn** — khay tự giãn, không bao giờ thua (test thoải mái).
- ⚡ **Nạp đầy** — kỹ năng tướng sẵn sàng ngay.
- 🎁 **+5 booster** — cộng 5 lượt cho cả 3 loại trợ giúp.

Người chơi thường mở `index.html` bình thường sẽ không thấy gì.

## Cấu trúc mã nguồn

```
index.html      — khung giao diện (home, game, popup)
css/style.css   — toàn bộ giao diện, responsive cho mobile
js/game.js      — logic game: sinh màn, luật chơi, booster, lưu trữ, BXH
```
