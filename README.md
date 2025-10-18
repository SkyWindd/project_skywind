cd "D:\PYTHON\New folder\project_skywind"

:: 1. Backup code cũ
git add .
git commit -m "Backup code cũ trước khi merge"

:: 2. Xóa index.lock nếu có lỗi
del .git\index.lock

:: 3. Thêm remote GitHub đúng URL
git remote add github-code https://github.com/SkyWindd/project_skywind.git

:: 4. Tải code từ GitHub về
git fetch github-code

:: 5. Tạo branch thử để merge an toàn
git checkout -b github-merge github-code/main

:: 6. Xem và sửa code nếu cần
:: (Mở VS Code để kiểm tra, sửa conflict nếu có)

:: 7. Merge vào branch chính khi chắc chắn
git checkout main
git merge github-merge

:: 8. Commit lần cuối sau khi chỉnh sửa xong
git add .
git commit -m "Hoàn tất merge code GitHub vào project cũ"
