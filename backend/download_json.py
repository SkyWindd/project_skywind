import requests

url = "https://raw.githubusercontent.com/daohoangson/dvhcvn/master/data/dvhcvn.json"
r = requests.get(url)

with open("vietnam_provinces.json", "wb") as f:
    f.write(r.content)

print("Đã tải thành công vietnam_provinces.json")
