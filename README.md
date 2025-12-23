# SkyWind – Website Thương mại điện tử (Dự án Kiểm thử Phần mềm)

## Cài đặt môi trường

**1. Clone repository**

```
git clone https://github.com/SkyWindd/project_skywind.git
```

**2. Chạy website bằng Docker**

```
docker compose up --build
```

## Mục lục

[1. Giới thiệu phần mềm](#1-giới-thiệu-phần-mềm)

&nbsp;&nbsp;[1.1. Tổng quan dự án](#11-tổng-quan-dự-án)

&nbsp;&nbsp;[1.2. Công nghệ sử dụng](#12-công-nghệ-sử-dụng)

&nbsp;&nbsp;[1.3. Thiết kế phần mềm](#13-thiết-kế-phần-mềm)

&nbsp;&nbsp;[1.4. Thiết kế kiến trúc](#3-thiết-kế-kiến-trúc)

[2. Kế hoạch kiểm thử](#2-kế-hoạch-kiểm-thử)

&nbsp;&nbsp;[2.1. Hạng mục được kiểm thử](#21-hạng-mục-được-kiểm-thử)

&nbsp;&nbsp;[2.2. Chiến lược kiểm thử](#22-chiến-lược-kiểm-thử)

[3. Thiết kế kiểm thử](#3-thiết-kế-kiểm-thử)

&nbsp;&nbsp;[3.1. Quy trình thiết kế kiểm thử theo V-Model](#31-quy-trình-thiết-kế-kiểm-thử-theo-v-model)

&nbsp;&nbsp;[3.2. Kỹ thuật thiết kế kiểm thử](#32-kỹ-thuật-thiết-kế-kiểm-thử)

&nbsp;&nbsp;[3.3. Phương pháp thiết kế kiểm thử](#33-phương-pháp-thiết-kế-kiểm-thử)

[4. Báo cáo kiểm thử](#4-báo-cáo-kiểm-thử)

&nbsp;&nbsp;[4.1. Báo cáo trường hợp kiểm thử](#41-báo-cáo-trường-hợp-kiểm-thử)

&nbsp;&nbsp;[4.2. Báo cáo lỗi](#42-báo-cáo-lỗi)

## 1. Giới thiệu phần mềm

### 1.1. Tổng quan dự án

Dự án kiểm thử “Website thương mại điện tử SkyWind” được thực hiện nhằm đánh giá mức độ đáp ứng các yêu cầu chức năng của hệ thống và phát hiện các lỗi phát sinh trong quá trình phát triển. Hoạt động kiểm thử tập trung vào việc xác minh tính đúng đắn của dữ liệu, sự ổn định trong quá trình vận hành và tính chính xác của các chức năng nghiệp vụ chính của website.

Quá trình kiểm thử bao gồm việc phân tích yêu cầu, xây dựng và thực thi các trường hợp kiểm thử, thực hiện kiểm thử đơn vị, kiểm thử tích hợp, kiểm thử hệ thống và kiểm thử chấp nhận nhằm đảm bảo hệ thống hoạt động đúng theo đặc tả trước khi triển khai sử dụng.

### 1.2. Công nghệ sử dụng

| Danh mục       | Tools / Frameworks                                                |
| -------------- | ------------------------------------------------------------------|
| Frontend       | Vite, ReactJS, JavaScript                                         |
| Backend        | Python, Maven                                                     |
| Database       | PostgreSQL                                                        |
| Authentication | JWT                                                               |
| Testing        | Mockito, PyTest, MockMvc, H2, Selenium, K6                        |
| CI/CD          | GitHub Actions                                                    |
| Deployment     | Render deploy Frotnend và Backend, Aiven host Database PostgreSQL |

### 1.3. Thiết kế phần mềm

### 1.3.1. Bối cảnh kinh doanh

Với Product Catalog, khách hàng có thể duyệt qua danh sách laptop với các bộ lọc theo hãng, giá, cấu hình (CPU, RAM, ổ cứng, card đồ họa, …). Khi chọn vào sản phẩm, khách hàng sẽ xem được thông tin chi tiết như tên, hình ảnh, thông số kỹ thuật, tình trạng tồn kho và đánh giá từ người mua khác (nếu có). Quản trị viên (SysAdmin) có quyền thêm, chỉnh sửa hoặc xóa sản phẩm, đồng thời gán sản phẩm vào kho phù hợp.

Với Shopping Cart, Người dùng có thể thêm laptop vào giỏ hàng hoặc mua ngay. Tại trang giỏ hàng, khách hàng sẽ thấy danh sách sản phẩm đã chọn cùng bảng tóm tắt gồm tên sản phẩm, giá sản phẩm, số lượng, giá trị đơn hàng, khuyến mãi, phí vận chuyển và tổng tiền cần thanh toán. Khi thêm hoặc xóa sản phẩm, giỏ hàng sẽ được cập nhật tự động. Sau đó, họ có thể thực hiện quy trình thanh toán bằng cách nhấn nút Thanh Toán. SysAdmin có thể theo dõi và xử lý các giỏ hàng bất thường để đảm bảo tính hợp lệ.

Với Payment Process, Sau khi khách hàng tiến hành đặt hàng (nhấn nút Thanh Toán), hệ thống sẽ xác thực thông tin sản phẩm, xử lý thanh toán trực tuyến và gửi email xác nhận kèm hóa đơn điện tử cho khách hàng.

Với Access Control, Người dùng cần đăng nhập để mua hàng, quản lý đơn hàng và đánh giá sản phẩm. SysAdmin khi đăng nhập sẽ truy cập vào trang quản trị để quản lý sản phẩm, đơn hàng và khách hàng. (Khách hàng và SysAdmin đăng nhập ở hai trang khác nhau)
Ngoài ra, một số công việc khởi tạo cần thiết khi triển khai hệ thống như: tạo tài khoản quản trị, tài khoản khách hàng mẫu, và nhập dữ liệu sản phẩm, tồn kho và đánh giá thử nghiệm.

### 1.3.2. Quy trình nghiệp vụ

**Quy trình xử lý giỏ hàng**

![](docs/images/qtnv1.png)

**Quy trình đặt hàng và thanh toán**

![](docs/images/qtnv2.png)

**Quy trình quản trị hệ thống**

![](docs/images/qtnv3.png)

### 1.3.3. Use case
<img width="199" height="410" alt="qtnv1" src="https://github.com/user-attachments/assets/5598422f-3500-4562-9d28-8a429fe3f686" />

**Use case summary**

![](docs/images/ucs.png)

**UC1 Quản lý sản phẩm**![Uploading qtnv1.png…]()


![](docs/images/uc1(admin).png)
![](docs/images/uc1(customer).png)

**UC2 Quản lý giỏ hàng**

![](docs/images/uc2.png)

**UC3 Quản lý đơn hàng**

![](docs/images/uc3.png)

**UC4 Quản lý thanh toán**

![](docs/images/uc4.png)

**UC6 Kiểm soát truy cập**

![](docs/images/uc5.png)

### 1.3.4. Domain driven design

**Mô tả miền nghiệp vụ**

Những lý do chính để chọn miền nghiệp vụ này:

1.	Đã có hệ thống thực tế cho miền nghiệp vụ này, vì vậy mọi người có thể đối chiếu phần triển khai với một trang web đang hoạt động.

2.	Miền nghiệp vụ cũng không quá đơn giản, vẫn có một số nghiệp vụ phức tạp và logic, không đơn thuần là các thao tác CRUD.

3.	Miền nghiệp vụ không quá phức tạp nên dễ hiểu và không quá lớn và dễ triển khai.

Sản phẩm có các thực thể chính gồm Laptop, Thành phần, Danh mục. Khách hàng có thể xem, tìm kiếm và lọc danh sách Laptop. Quản trị viên hệ thống và nhân viên bán hàng có thể CRUD đối với Laptop, Danh mục, CPU, GPU, RAM, SSD.

Giỏ hàng chỉ khách hàng đã đăng nhập mới có thể thêm sản phẩm vào Giỏ hàng. Khách hàng có thể xem lại, thay đổi số lượng hoặc xóa sản phẩm khỏi Giỏ hàng và sau đó tiến hành đặt hàng và thanh toán.

Đơn hàng có thực thể chính là Đơn hàng và Chi tiết đơn hàng. Sau khi đã thêm sản phẩm vào giỏ hàng, khách hàng nhập thông tin giao hàng và phương thức thanh toán sẽ tạo đơn hàng. Quản trị viên hệ thống và nhân viên bán hàng có thể cập nhật trạng thái Đơn hàng.

Thanh toán có thực thể chính là Thanh toán, Phương thức thanh toán, Tình trạng thanh toán. Khách hàng có thể lựa chọn thanh toán bằng Momo/Ngân hàng. Quản trị viên hệ thống có thể xem danh sách các giao dịch Thanh toán.

Kiểm soát truy cập có thực thể chính là Người dùng và Chức vụ. Người dùng gồm Khách hàng, Quản trị viên hệ thống. Mỗi người dùng có thể đăng nhập vào hệ thống, đăng xuất khỏi hệ thống. Quản trị viên hệ thống có quyền quản lý các tài khoản người dùng.

**Mô hình khái niệm**

![](docs/images/conceptualmodel.png)

### 1.3.5. Data model

**Mô hình thực thể kết hợp mức khái niệm**

![](docs/images/erd1.png)

**Mô hình thực thể kết hợp mức logic**

![](docs/images/erd2.png)

**Mô hình thực thể kết hợp mức vật lý**

![](docs/images/erd3.png)

### 1.4. Thiết kế kiến trúc

### 1.4.1. Sơ đồ khối

![](docs/images/block.png)

### 1.4.2. Kiến trúc C4

**C1 - System context**

![](docs/images/c1.png)

**C2 – Container**

![](docs/images/c2.png)

**C3 – Component (high-level)**

![](docs/images/c3.png)

**C4 – Code**

**Sơ đồ lớp**

![](docs/images/class.png)


### 1.4.3. Sơ đồ triển khai

![](docs/images/deployment.png)

## 2. Kế hoạch kiểm thử

### 2.1. Hạng mục được kiểm thử

### 2.1.1. Chức năng

**Kiểm soát truy cập**

- Xác minh rằng hệ thống cho phép đăng nhập cho chức vụ là khách hàng, quản trị viên.

- Xác minh rằng hệ thống cho phép đăng ký tài khoản cho khách hàng.

- Xác minh rằng hệ thống cho phép đăng xuất đối với tất cả người dùng đã đăng nhập.

- Xác minh rằng hệ thống thực thi phân quyền truy cập đúng, chỉ cho phép người dùng truy cập các chức năng phù hợp với vai trò của mình.

**Quản lý sản phẩm**

- Xác minh rằng hệ thống cung cấp các thao tác CRUD chức năng quản lý sản phẩm cho quản trị viên.

- Xác minh rằng hệ thống hỗ trợ quản lý liên quan đến sản phẩm, gồm có: thông tin sản phẩm, trạng thái sản phẩm , giá sản phầm 

- Xác minh rằng hệ thống cho phép khách hàng truy cập và xem danh sách sản phẩm.

- Xác minh rằng hệ thống hỗ trợ các chức năng tìm kiếm, lọc và sắp xếp sản phẩm nhằm giúp khách hàng dễ dàng tìm kiếm sản phẩm mong muốn.

- Xác minh rằng hệ thống đảm bảo tính nhất quán và chính xác của dữ liệu sản phẩm giữa giao diện người dùng và hệ thống backend.

**Quản lý giỏ hàng**

- Xác minh rằng hệ thống tự động cập nhật và hiển thị chính xác thông tin giỏ hàng, bao gồm danh sách sản phẩm, số lượng và tổng tiền.

- Xác minh rằng hệ thống đảm bảo tính nhất quán dữ liệu giỏ hàng trong suốt quá trình người dùng thao tác và chuyển đổi giữa các trang.

- Xác minh rằng hệ thống có các ràng buộc nghiệp vụ đối với giỏ hàng giới hạn số lượng mua một sản phẩm theo số lượng hiện có.	

- Xác minh rằng hệ thống cho phép khách hàng tiếp tục quy trình mua hàng từ giỏ hàng để chuyển sang bước đặt hàng.

**Quản lý đơn hàng**

- Xác minh rằng hệ thống cung cấp đầy đủ quản lý đơn hàng cho khách hàng, bao gồm đặt hàng, xem danh sách đơn hàng và xem chi tiết đơn hàng đã đặt.

- Xác minh rằng hệ thống cung cấp đầy đủ các chức năng quản lý đơn hàng cho quản trị viên, bao gồm xem danh sách, tìm kiếm, lọc và cập nhật trạng thái đơn hàng.

- Xác minh rằng hệ thống hỗ trợ quy trình xử lý đơn hàng theo đúng nghiệp vụ, từ lúc tạo đơn hàng đến khi hoàn tất 

- Xác minh rằng hệ thống đảm bảo tính chính xác và nhất quán của dữ liệu đơn hàng, bao gồm trạng thái đơn hàng, thông tin sản phẩm và tổng tiền.

**Quản lý thanh toán**

- Xác minh rằng hệ thống cung cấp đầy đủ các phương thức thanh toán cho khách hàng, bao gồm thanh toán khi nhận hàng và thanh toán Banking và thanh toán MoMo.

- Xác minh rằng hệ thống đảm bảo tính nhất quán và chính xác của dữ liệu thanh toán và đơn hàng.

### 2.1.2. Khả năng sử dụng

Xác minh rằng hệ thống cung cấp thanh điều hướng rõ ràng, cho phép người dùng truy cập các trang chính như trang chủ, danh sách sản phẩm, giỏ hàng và đơn hàng.

Xác minh rằng người dùng có thể dễ dàng quay lại trang trước hoặc trang chủ trong quá trình sử dụng.

Xác minh rằng các nút chức năng chính được hiển thị rõ ràng, dễ nhận biết và dễ thao tác.

### 2.1.3. Tương thích

Xác minh rằng giao diện website hiển thị đúng và đồng nhất trên các trình duyệt phổ biến như Chrome, Firefox và Safari.

Xác minh rằng hệ thống tự động điều chỉnh giao diện phù hợp với các kích thước màn hình khác nhau (Desktop, Tablet, Mobile).

Xác minh rằng các thành phần giao diện không bị vỡ hoặc lệch khi thay đổi kích thước màn hình

Xác minh rằng người dùng có thể thao tác đầy đủ các chức năng trên các thiết bị khác nhau.

### 2.1.4. Giao diện

Xác minh rằng các màu sắc, font chữ và kiểu hiển thị đúng theo thiết kế.

Xác minh rằng logo, hình ảnh, icon được hiển thị đúng vị trí và không bị biến dạng.

Xác minh rằng các thông báo lỗi, cảnh báo, hoặc thông tin trạng thái hiển thị đúng theo ngữ cảnh nghiệp vụ.

### 2.1.5. Bảo mật

Xác minh rằng mật khẩu người dùng được mã hóa an toàn khi lưu trữ trong hệ thống.

Xác minh rằng hệ thống thực thi đúng cơ chế kiểm soát truy cập theo vai trò và không cho phép truy cập trái phép.

Xác minh rằng các API quan trọng được bảo vệ bằng cơ chế xác thực và phân quyền phù hợp.

### 2.1.6. Cơ sở dữ liệu

Xác minh rằng các thao tác CRUD trên hệ thống được phản ánh chính xác trong cơ sở dữ liệu.

Xác minh rằng dữ liệu được lưu trữ đúng định dạng và kiểu dữ liệu theo thiết kế.

Xác minh rằng các mối quan hệ giữa các bảng dữ liệu (khóa chính, khóa ngoại và các ràng buộc) được duy trì chính xác.

Xác minh rằng các truy vấn tìm kiếm, lọc và báo cáo dữ liệu trả về kết quả đúng và trong thời gian chấp nhận được.

Xác minh rằng hệ thống có thể chịu được tải cực đại mà không bị crash (stress testing).

### 2.1.7. Hiệu năng

Xác minh rằng thời gian phản hồi của các chức năng chính như xem sản phẩm, thêm giỏ hàng và đặt hàng nằm trong ngưỡng cho phép.

Xác minh rằng hệ thống vẫn hoạt động ổn định khi có nhiều yêu cầu truy cập đồng thời ở ức giả lập.

### 2.1.9. Hồi quy

Xác minh rằng các chức năng hiện có của hệ thống vẫn hoạt động đúng sau khi có thay đổi hoặc nâng cấp.

Xác minh rằng các endpoint API, giao diện người dùng, cơ sở dữ liệu và các quy trình nghiệp vụ vẫn tương thích và chính xác.

Xác minh rằng các luồng nghiệp vụ chính của hệ thống vẫn hoạt động ổn định.

### 2.1.10. API

Xác minh rằng các endpoint API hoạt động đúng chức năng theo thiết kế.

Xác minh rằng dữ liệu trả về từ API đầy đủ, chính xác và tuân theo định dạng quy định.

Xác minh rằng các API được bảo vệ đúng quyền truy cập và không cho phép người dùng truy cập trái phép.

Xác minh rằng các API tương tác đúng với cơ sở dữ liệu, giao diện người dùng và các endpoint liên quan khác.

Xác minh rằng các luồng nghiệp vụ chính thông qua API vẫn hoạt động ổn định sau khi có thay đổi hệ thống.

### 2.2. Chiến lược kiểm thử

### 2.2.1. Phương pháp kiểm thử

Dự án áp dụng mô hình V-Model trong kiểm thử phần mềm, trong đó các hoạt động kiểm thử được thực hiện song song với các giai đoạn phát triển. Mỗi giai đoạn phát triển tương ứng với một cấp độ kiểm thử nhằm đảm bảo chất lượng phần mềm xuyên suốt vòng đời phát triển.

Cụ thể, dự án thực hiện các cấp độ kiểm thử bao gồm: kiểm thử đơn vị, kiểm thử tích hợp, kiểm thử hệ thống và kiểm thử chấp. Các Test Case được thiết kế dựa trên yêu cầu chức năng và các use case của hệ thống.

Bên cạnh đó, dự án áp dụng kiểm thử tự động thông qua quy trình CI/CD sử dụng GitHub Actions, nhằm tự động hóa các bước Build, Test và Deploy.

### 2.2.2. Loại kiểm thử

| Loại kiểm thử                          | Mục đích                                                                                                                                       | Kỹ thuật / Công cụ                                                     | Tiêu chí chấp nhận                                                                                 |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Kiểm thử chức năng**                 | Đảm bảo các chức năng kiểm soát truy cập, quản lý sản phẩm, giỏ hàng, đơn hàng, thanh toán và sổ địa chỉ hoạt động đúng theo yêu cầu nghiệp vụ | Manual Testing; Automation Testing với PyTest (Backend), Selenium (UI) | Các chức năng hoạt động đúng nghiệp vụ; không có lỗi nghiêm trọng ảnh hưởng đến quy trình mua hàng |
| **Kiểm thử khả năng sử dụng**          | Đảm bảo người dùng có thể dễ dàng thao tác, điều hướng và sử dụng website                                                                      | Kiểm thử thủ công trên giao diện ReactJS                               | Giao diện dễ sử dụng, luồng nghiệp vụ rõ ràng, thao tác thuận tiện                                 |
| **Kiểm thử tương thích**               | Đảm bảo website hiển thị và hoạt động đúng trên nhiều trình duyệt và thiết bị khác nhau                                                        | Manual Testing trên Chrome, Firefox, Safari; Responsive Testing        | Giao diện hiển thị đúng, không vỡ layout; người dùng sử dụng đầy đủ chức năng                      |
| **Kiểm thử giao diện**                 | Đảm bảo giao diện hiển thị đúng thiết kế và thông tin được trình bày chính xác                                                                 | Manual Testing                                                         | Màu sắc, font chữ, hình ảnh và thông báo hiển thị đúng theo thiết kế                               |
| **Kiểm thử bảo mật**                   | Đảm bảo an toàn thông tin người dùng và kiểm soát truy cập hệ thống                                                                            | Kiểm thử xác thực và phân quyền API bằng PyTest                        | Không cho phép truy cập trái phép; mật khẩu được mã hóa an toàn                                    |
| **Kiểm thử cơ sở dữ liệu**             | Đảm bảo dữ liệu được lưu trữ, cập nhật và liên kết chính xác trong hệ quản trị CSDL                                                            | Integration Testing với PyTest và PostgreSQL                           | Dữ liệu chính xác, toàn vẹn, đúng ràng buộc khóa chính và khóa ngoại                               |
| **Kiểm thử hồi quy**                   | Đảm bảo các chức năng hiện có không bị ảnh hưởng sau khi hệ thống thay đổi hoặc nâng cấp                                                       | Automation Testing với PyTest và Selenium                              | Các luồng nghiệp vụ chính vẫn hoạt động ổn định                                                    |
| **Kiểm thử API**                       | Đảm bảo các endpoint API hoạt động đúng chức năng, bảo mật và nhất quán dữ liệu                                                                | API Testing với PyTest và thư viện `requests`                          | API trả về dữ liệu đúng, đúng định dạng và đúng quyền truy cập                                     |
| **Kiểm thử xử lý lỗi và dữ liệu biên** | Đảm bảo hệ thống xử lý đúng các trường hợp dữ liệu không hợp lệ hoặc vượt giới hạn                                                             | Manual Testing; Automation Testing với PyTest                          | Hệ thống hiển thị thông báo lỗi phù hợp; không xảy ra lỗi hệ thống                                 |
| **Kiểm thử hiệu năng (mức cơ bản)**    | Đảm bảo hệ thống phản hồi trong thời gian chấp nhận được đối với các chức năng chính                                                           | Kiểm thử thủ công, đo thời gian phản hồi                               | Thời gian phản hồi nằm trong ngưỡng cho phép; hệ thống hoạt động ổn định                           |


### 2.2.3. Cấp độ kiểm thử

| Loại                      | Kiểm thử đơn vị | Kiểm thử tích hợp | Kiểm thử hệ thống | Kiểm thử chấp nhận |
| ------------------------- | --------------- | ----------------- | ----------------- | ------------------ |
| Kiểm thử chức năng        | x               | x                 | x                 | x                  |
| Kiểm giao diện            |                 |                   | x                 | x                  |
| Kiểm thử cơ sở dữ liệu    | x               | x                 |                   |                    |
| Kiểm thử tương thích      |                 |                   | x                 | x                  |
| Kiểm thử bảo mật          | x               | x                 | x                 |                    |
| Kiểm thử hiệu năng        |                 |                   | x                 |                    |
| Kiểm thử khả năng sử dụng |                 |                   | x                 | x                  |
| Kiểm thử hồi quy          | x               | x                 | x                 |                    |
| Kiểm thử API              | x               | x                 |                   |                    |

## 3. Thiết kế kiểm thử

### 3.1. Quy trình thiết kế kiểm thử theo V-Model

### 3.1.1. Phân tích yêu cầu - 1a

Ở giai đoạn đầu tiên, nhóm tiến hành thu thập, phân tích và làm rõ các yêu cầu nghiệp vụ của hệ thống bán laptop trực tuyến. Mục tiêu của bước này là đảm bảo tất cả yêu cầu được mô tả đầy đủ, đúng phạm vi và có thể kiểm thử được. Nhóm xây dựng tài liệu đặc tả yêu cầu phần mềm (SRS) làm cơ sở cho toàn bộ hoạt động kiểm thử về sau.

Từ quá trình phân tích, nhóm xác định hệ thống có hai đối tượng sử dụng chính (Khách hàng và Quản trị viên) và phân rã thành 6 module chức năng: Quản lý sản phẩm, Giỏ hàng, Đơn hàng, Thanh toán, Kiểm soát truy cập.

Kết quả phân tích yêu cầu là nền tảng trực tiếp cho việc xây dựng các trường hợp kiểm thử chấp nhận. Các yêu cầu được chuyển hóa thành tiêu chí nghiệm thu, đảm bảo rằng mọi chức năng người dùng mong đợi đều có thể được xác minh thông qua kiểm thử.

### 3.1.2. Phân tích hệ thống - 2a

Sau khi yêu cầu đã được xác định rõ, nhóm tiến hành thiết kế hệ thống ở mức tổng thể. Nội dung thiết kế bao gồm việc mô tả các chức năng chính, các luồng nghiệp vụ, các sơ đồ use case và mối quan hệ giữa các tác nhân tương tác với hệ thống.

Thông tin từ giai đoạn này được dùng để xây dựng kịch bản kiểm thử hệ thống. Các chức năng được mô tả trong sơ đồ use case sẽ trở thành đối tượng kiểm thử, bảo đảm rằng hệ thống vận hành đúng theo luồng nghiệp vụ tổng quan.

### 3.1.3. Phân tích kiến trúc - 3a

Trong giai đoạn thiết kế kiến trúc, nhóm áp dụng kiến trúc C4 Model (Context – Container – Component – Code) để phân rã hệ thống từ cấp độ ngữ cảnh đến cấp độ thành phần. Mục đích là xác định rõ giao tiếp giữa các tầng, sự phân tách trách nhiệm và luồng dữ liệu giữa các thành phần trong kiến trúc tổng thể.

Kết quả thiết kế kiến trúc là cơ sở để xây dựng kiểm thử tích hợp. Các điểm giao tiếp giữa các module – như giữa API và database, giữa backend và frontend – được liệt kê và phân tích để thiết kế các trường hợp kiểm thử nhằm đánh giá tính chính xác của việc trao đổi dữ liệu giữa các thành phần.

### 3.1.4. Phân tích module - 4a

Trong bước thiết kế module, nhóm thực hiện phân tích và thiết kế từng module của hệ thống. Các sơ đồ lớp (Class Diagram) được sử dụng để mô tả cấu trúc dữ liệu, thuộc tính, phương thức và mối quan hệ giữa các lớp.

Tài liệu từ bước này được sử dụng để xây dựng các trường hợp kiểm thử đơn vị. Các lớp và phương thức trọng yếu của từng module được xác định để viết kiểm thử tự động, giúp phát hiện sớm lỗi ở mức độ thấp nhất trước khi module được tích hợp vào hệ thống.

### 3.1.5. Kiểm thử đơn vị - 1b

Dựa trên thiết kế module, nhóm tiến hành xây dựng và thực thi các trường hợp kiểm thử đơn vị để đánh giá tính đúng đắn của từng phương thức, hàm hoặc lớp độc lập.
Mục tiêu của kiểm thử đơn vị là đảm bảo từng thành phần nhỏ nhất hoạt động chính xác theo mô tả trong thiết kế, từ đó giảm thiểu rủi ro lỗi lan truyền sang các giai đoạn tích hợp và triển khai.

Các ca kiểm thử đơn vị được triển khai kiểm thử tự động bằng JUnit kết hợp với Mockito để mô phỏng (mock) các đối tượng phụ thuộc, giúp tách biệt logic kiểm thử khỏi các thành phần bên ngoài như database hay service khác. Việc sử dụng Mockito cho phép nhóm cô lập và kiểm tra từng hàm một cách chính xác, đặc biệt trong các tình huống cần mô phỏng dữ liệu hoặc hành vi phức tạp.

Toàn bộ kiểm thử đơn vị được tích hợp vào môi trường CI/CD thông qua GitHub Actions, cho phép các bài test chạy tự động mỗi khi có cập nhật mã nguồn. Điều này giúp nhóm phát hiện lỗi sớm, ổn định chất lượng phần mềm trong suốt quá trình phát triển.

### 3.1.6. Kiểm thử tích hợp - 2b

Sau khi từng module đã ổn định thông qua kiểm thử đơn vị, nhóm tiến hành kiểm thử tích hợp để đánh giá sự tương tác giữa các thành phần trong hệ thống.

Kiểm thử tích hợp tập trung vào việc xác minh dữ liệu truyền tải qua các API, các tầng giao tiếp giữa Controller – Service – Repository, cũng như sự tương thích giữa backend và database.
Nhóm sử dụng Spring Boot Test kết hợp MockMvc để kiểm thử tích hợp API trong môi trường mô phỏng gần giống thực tế.
MockMvc cho phép gửi request, nhận response và kiểm tra toàn bộ luồng xử lý mà không cần chạy ứng dụng thực tế trên server. Ngoài ra, cơ sở dữ liệu trong quá trình kiểm thử được thay thế bằng H2 Database (in-memory) nhằm đảm bảo kiểm thử có tính cô lập, lặp lại và không gây ảnh hưởng đến dữ liệu thật.

Các ca kiểm thử tích hợp được thiết kế dựa trên những điểm giao tiếp đã xác định trong giai đoạn Thiết kế kiến trúc, đảm bảo quá trình kiểm thử tuân thủ đúng cấu trúc hệ thống và bao phủ toàn bộ các luồng tương tác quan trọng.

### 3.1.7. Kiểm thử hệ thống - 3b

Ở cấp độ cao hơn, nhóm tiến hành kiểm thử hệ thống nhằm đánh giá toàn bộ hoạt động của phần mềm như một thể thống nhất. Kiểm thử hệ thống được thực hiện theo cách tiếp cận thủ công dựa trên tập Test Case đã được xây dựng ở giai đoạn thiết kế kiểm thử, bao gồm đầy đủ các tình huống theo use case và luồng nghiệp vụ chính của người dùng.

Các hoạt động kiểm thử bao gồm:

- Kiểm thử chức năng: kiểm tra các luồng nghiệp vụ từ đầu đến cuối (end-to-end) như đăng nhập, mua hàng, thanh toán…

- Kiểm thử giao diện: đảm bảo giao diện trực quan, nhất quán và đáp ứng tiêu chuẩn hiển thị.

- Kiểm thử bảo mật cơ bản: xác minh luồng đăng nhập, phân quyền và kiểm soát truy cập.

Kết quả kiểm thử hệ thống phản ánh chất lượng tổng thể của phần mềm trước khi chuyển sang giai đoạn nghiệm thu.

### 3.1.8. Kiểm thử chấp nhận - 4b

Kiểm thử chấp nhận là giai đoạn cuối cùng của quy trình kiểm thử, nhằm đánh giá hệ thống dưới góc nhìn người dùng thực tế. Ở bước này, nhóm đối chiếu các tiêu chí nghiệm thu với tài liệu SRS để đảm bảo hệ thống đáp ứng đầy đủ yêu cầu của khách hàng.

Sau khi hoàn thành kiểm thử hệ thống nội bộ, phần mềm được bàn giao cho Product Owner tiến hành kiểm thử chấp nhận. Product Owner sẽ đóng vai trò người dùng cuối, mô phỏng các tình huống thực tế và đưa ra đánh giá về mức độ đáp ứng nhu cầu, tính tiện dụng, độ ổn định và mức độ phù hợp với nghiệp vụ.

Kết quả kiểm thử chấp nhận là căn cứ quan trọng để đưa ra quyết định cuối cùng về việc triển khai hệ thống lên môi trường vận hành.

### 3.2. Kỹ thuật thiết kế kiểm thử

### 3.2.1. Kiểm thử hộp đen

Kiểm thử hộp đen là kỹ thuật kiểm thử chính được áp dụng xuyên suốt trong đồ án. Với kỹ thuật này, hệ thống được kiểm tra dựa trên hành vi bên ngoài thông qua dữ liệu đầu vào và kết quả đầu ra, không xét đến cấu trúc hay logic cài đặt bên trong mã nguồn. Kỹ thuật kiểm thử hộp đen được sử dụng trong toàn bộ các test case chức năng, bao gồm kiểm thử đăng nhập, đăng ký, phân quyền, quản lý sản phẩm, giỏ hàng, đơn hàng và thanh toán. Đối với API Testing, các endpoint được kiểm tra thông qua các request hợp lệ và không hợp lệ để xác minh mã trạng thái HTTP, dữ liệu phản hồi và thông báo lỗi. Việc áp dụng kiểm thử hộp đen giúp đảm bảo hệ thống đáp ứng đúng yêu cầu nghiệp vụ và phù hợp với góc nhìn của người dùng cuối.

### 3.2.2. Phân lớp tương đương (Equivalence Partitioning)

Kỹ thuật phân lớp tương đương được áp dụng nhằm giảm số lượng test case nhưng vẫn đảm bảo độ bao phủ kiểm thử. Các dữ liệu đầu vào được chia thành các lớp hợp lệ và không hợp lệ, sau đó lựa chọn các giá trị đại diện để thực hiện kiểm thử. Kỹ thuật này được sử dụng rõ rệt trong các chức năng xác thực và nhập liệu, bao gồm đăng nhập, đăng ký tài khoản, cập nhật thông tin người dùng, thêm hoặc chỉnh sửa sản phẩm và nhập thông tin thanh toán. Ví dụ, trong chức năng đăng nhập, dữ liệu được chia thành các lớp như tài khoản hợp lệ, tài khoản không tồn tại, mật khẩu sai và dữ liệu trống. Việc áp dụng phân lớp tương đương giúp phát hiện lỗi hiệu quả mà không cần kiểm thử toàn bộ các trường hợp dữ liệu có thể xảy ra.

### 3.2.3. Kiểm thử giá trị biên (Boundary Value Analysis)

Kiểm thử giá trị biên được áp dụng cho các chức năng có ràng buộc về giới hạn dữ liệu nhằm đảm bảo hệ thống xử lý chính xác các trường hợp tại ngưỡng. Kỹ thuật này được sử dụng chủ yếu trong các chức năng liên quan đến số lượng sản phẩm trong giỏ hàng, tồn kho sản phẩm, số lượng đặt mua và các trường bắt buộc trong biểu mẫu. Các trường hợp như số lượng bằng 0, bằng tồn kho, vượt quá tồn kho hoặc để trống trường dữ liệu được kiểm thử nhằm phát hiện các lỗi tiềm ẩn tại ranh giới điều kiện nghiệp vụ. Việc áp dụng kiểm thử giá trị biên giúp hạn chế các lỗi nghiêm trọng có thể ảnh hưởng trực tiếp đến dữ liệu và quy trình mua hàng.

### 3.2.4. Kiểm thử dựa trên luồng nghiệp vụ (Workflow-based Testing)

Kiểm thử dựa trên luồng nghiệp vụ được áp dụng thông qua việc xây dựng TestDesign_Workflow từ các sơ đồ activity của hệ thống. Mỗi workflow phản ánh đầy đủ các bước xử lý nghiệp vụ từ khi người dùng bắt đầu thao tác cho đến khi kết thúc chức năng. Kỹ thuật này được sử dụng cho các chức năng chính như đăng nhập, duyệt và tìm kiếm sản phẩm, thêm vào giỏ hàng, đặt hàng, thanh toán và quản lý đơn hàng của quản trị viên. Các test case được liên kết trực tiếp với từng bước trong workflow nhằm đảm bảo mọi nhánh xử lý, bao gồm cả luồng thành công và luồng lỗi, đều được kiểm thử. Kiểm thử theo luồng nghiệp vụ giúp đánh giá tính toàn vẹn của quy trình và khả năng phối hợp giữa frontend, backend và cơ sở dữ liệu.

### 3.2.5. Kiểm thử dựa trên vai trò và phân quyền (Role-based Testing)

Kỹ thuật kiểm thử dựa trên vai trò được áp dụng để đảm bảo hệ thống thực thi đúng cơ chế phân quyền truy cập. Các test case được thiết kế riêng cho từng vai trò như Buyer và Admin nhằm kiểm tra khả năng truy cập chức năng, giới hạn quyền và xử lý truy cập trái phép. Kỹ thuật này được sử dụng trong các chức năng truy cập trang quản trị, quản lý sản phẩm, quản lý đơn hàng và các API dành riêng cho quản trị viên. Việc kiểm thử theo vai trò giúp đảm bảo tính bảo mật, ngăn chặn truy cập trái phép và tuân thủ đúng yêu cầu nghiệp vụ đã đặt ra.

### 3.2.6. Kiểm thử API (API Testing)

Kiểm thử API được áp dụng để kiểm tra các dịch vụ backend độc lập với giao diện người dùng. Các API liên quan đến xác thực, sản phẩm, giỏ hàng, đơn hàng và thanh toán được kiểm thử bằng công cụ Postman và MockMvc. Các test case tập trung vào việc kiểm tra phương thức HTTP, dữ liệu request, dữ liệu response, mã trạng thái và xử lý lỗi. Đối với các API tích hợp bên thứ ba như thanh toán MoMo, các trường hợp redirect, thành công và thất bại đều được kiểm thử nhằm đảm bảo hệ thống xử lý đúng các tình huống phát sinh. Kiểm thử API giúp phát hiện lỗi sớm ở tầng backend và hỗ trợ hiệu quả cho kiểm thử tích hợp.

### 3.2.7. Kiểm thử khả năng sử dụng (Usability Testing)

Kiểm thử khả năng sử dụng được thực hiện dưới hình thức kiểm thử thủ công nhằm đánh giá trải nghiệm người dùng. Các test case usability được thiết kế cho các chức năng chính như đăng nhập, tìm kiếm sản phẩm, thao tác giỏ hàng, nhập địa chỉ và thanh toán. Nội dung kiểm thử tập trung vào bố cục giao diện, khả năng nhận biết nút chức năng, thông báo phản hồi và mức độ dễ hiểu của các biểu mẫu. Việc áp dụng kiểm thử usability giúp đảm bảo hệ thống thân thiện với người dùng và đáp ứng tốt nhu cầu sử dụng thực tế.

### 3.3. Phương pháp thiết kế kiểm thử

### 3.3.1. Kiểm thử thủ công

Dự án áp dụng kiểm thử thủ công cho giai đoạn kiểm thử chấp nhận. Phương pháp này được sử dụng nhằm đánh giá hệ thống dưới góc nhìn người dùng cuối, kiểm tra các luồng nghiệp vụ chính và xác nhận mức độ đáp ứng của hệ thống so với các yêu cầu đã đặc tả.

Các ca kiểm thử thủ công được thực hiện dựa trên Test Case và Review Checklist đã thiết kế, kết quả kiểm thử được ghi nhận và đối chiếu với kết quả mong đợi trước khi tiến hành nghiệm thu hệ thống.

### 3.3.2. Kiểm thử tự động

Dự án áp dụng kiểm thử tự động thông qua việc tích hợp quy trình CI/CD bằng GitHub Actions nhằm tự động hóa quá trình build, kiểm thử và triển khai hệ thống. Kiểm thử tự động được sử dụng cho các kiểm thử hộp trắng bao gồm kiểm thử đơn vị và kiểm thử tích hợp và kiểm thử hệ thống.

Mỗi khi có thay đổi mã nguồn được đẩy lên kho lưu trữ GitHub, pipeline CI/CD sẽ tự động kích hoạt job test Job này thực hiện các bước build dự án và chạy toàn bộ các bộ kiểm thử tự động đã được xây dựng.

- Nếu job test thất bại, pipeline sẽ tự động tạo Issue trên GitHub để ghi nhận lỗi phát sinh, hỗ trợ nhóm phát triển theo dõi và xử lý kịp thời.

- Nếu job test thành công, pipeline sẽ tự động đóng các Issue liên quan đến lỗi kiểm thử trước đó, đảm bảo trạng thái hệ thống luôn được cập nhật chính xác.

Khi mã nguồn được merge vào nhánh chính (Main), pipeline CI/CD sẽ kích hoạt job deploy, thực hiện gọi đến nền tảng Render để tiến hành triển khai lại hệ thống.

![](docs/images/pipeline-cicd.png)

![](docs/images/workflow.png)

## 4. Báo cáo kiểm thử

### 4.1. Báo cáo trường hợp kiểm thử

### 4.1.1. Giới thiệu

Các trường hợp kiểm thử này được phân loại thành hai nhóm Positive (kiểm tra hành vi đúng với mong đợi của hệ thống) và Negative (kiểm tra khả năng xử lý lỗi, ngoại lệ và điều kiện không hợp lệ).

Bộ kiểm thử được xây dựng cho 6 module chức năng chính của hệ thống gồm kiểm soát truy cập, sản phẩm, giỏ hàng, đơn hàng, thanh toán và sổ địa chỉ, với tổng cộng 72 trường hợp kiểm thử.

### Kết quả kiểm thử hệ thống (System Test)

| Module              | Mã              | Số lượng | Mô tả                                                                 | Kết quả            |
|---------------------|-----------------|----------|-----------------------------------------------------------------------|--------------------|
| Authentication      | TC-AUTH-SYS     | 11       | Kiểm tra các quy trình đăng nhập, đăng ký;<br>Kiểm tra thêm/sửa/xóa người dùng | 11 Pass            |
| Product Management  | TC-PROD-SYS     | 12       | Kiểm tra hiển thị, tìm kiếm, lọc sản phẩm cho khách hàng;<br>Kiểm tra thêm/sửa/xóa cho quản trị viên | 11 Pass, 1 Fail    |
| Cart                | TC-CART-SYS     | 8        | Kiểm tra thêm, sửa, xóa và kiểm tra số lượng tồn kho khi thêm vào giỏ hàng | 8 Pass             |
| Order               | TC-ORDER-SYS    | 5        | Kiểm tra quản lý và cập nhật trạng thái đơn hàng của quản trị viên     | 5 Pass             |
| Payment             | TC-PAY-SYS      | 8        | Kiểm tra phương thức thanh toán (COD, MoMo) và các kịch bản giao dịch | 8 Pass             |

### Kết quả kiểm thử Unit / Integration / Automation

| Module              | Mã        | Số lượng | Loại kiểm thử        | Kết quả  |
|---------------------|-----------|----------|---------------------|----------|
| Authentication      | UT-AUTH   | 5        | Unit Test           | 5 Pass   |
| Product Management  | UT-PROD   | 7        | Unit Test           | 7 Pass   |
| Product Management  | IT-PROD   | 4        | Integration Test    | 4 Pass   |
| Order               | UT-ORDER  | 6        | Unit Test           | 6 Pass   |
| Payment             | UT-PAY    | 4        | Unit Test           | 4 Pass   |
| Payment             | IT-PAY    | 1        | Integration Test    | 1 Pass   |
| User                | IT-USER   | 2        | Integration Test    | 2 Fail   |
| Selenium             | SEL       | 2        | UI Automation Test  | 2 Pass   |
| Performance         | UT-PERM   | 3        | Performance Test    | 3 Pass   |

> Hệ thống SkyWind đã được kiểm thử đầy đủ ở nhiều cấp độ bao gồm kiểm thử hệ thống, kiểm thử đơn vị, kiểm thử tích hợp, kiểm thử giao diện tự động (Selenium) và kiểm thử hiệu năng.  
> Kết quả cho thấy đa số các test case đều đạt (Pass), chỉ còn một số lỗi mức thấp và trung bình đã được ghi nhận và xử lý trong quá trình kiểm thử.


### 4.1.2. Thống kê kết quả thực thi

Biểu đồ tròn hiện thị tỷ lệ phần trăm thực thi của tất cả các Test Case

Tổng cộng 78 Test Case trong đó có 75 thành công và 3 thất bại.

•	97.2% các Test Case thành công (Passed).

•	2.8% các Test Case thất bại (Failed).

•	0% các Test Case bị chặn (Blocked).

•	0% các Test Case chưa chạy (Not run).

![](docs/images/testcase-ex.png)

### 4.2. Báo cáo lỗi

### 4.2.1. Phân loại lỗi theo mức độ nghiêm trọng

Trong quá trình kiểm thử Test Case, nhóm đã phát hiện và ghi nhận 3 lỗi. Các lỗi này được phân loại theo mức độ nghiêm trọng như sau:

Severity 2 – High: có 1 lỗi đây là lỗi liên quan đến hệ thống. Lỗi khá nghiêm trọng là quản trị viên không xóa được sản phẩm.

Severity 4 – Low: có 1 lỗi đây là lỗi nhỏ, khi kiểm thử intergration test thì không tạo được user mới nhưng trên trang sản phẩm của người dùng vẫn thêm được user mới.

Severity 4 – Low: có 1 lỗi đây là lỗi nhỏ, khi kiểm thử intergration test thì không lấy được IDuser mới nhưng trên trang sản phẩm của người dùng vẫn thêm được user mới.


### 4.2.2. Thống kê lỗi

Biểu đồ cột hiện thị số lượng lỗi của Test Case theo mức độ nghiêm trọng.

Tổng cộng 3 lỗi được phát hiện, trong đó:

•	66% là 2 lỗi mức thấp (low).

•	33% là 1 lỗi mức cao (high)

•	0 lỗi mức nghiêm trọng (critical) và trung bình (medium).

Số lượng lỗi đã được sửa đã sửa 2 lỗi mức thấp và 1 lỗi mức cao

Số lượng lỗi còn tồn đọng là 0 lỗi ở bất kỳ mức độ nào.

![](docs/images/defect.png)
