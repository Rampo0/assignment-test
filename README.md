# Info
**Admin credentials** <br>
email / username	: admin@sejutacita.id <br>
password			: password

**Postman link** <br>
Gunakan production environment pada postman docs <br>
link : [sejutacita api docs](https://documenter.getpostman.com/view/11962530/TVsskUi6)

**Host** <br>
host : ec2-3-238-237-81.compute-1.amazonaws.com

# Arsitektur

![alt text](https://github.com/Rampo0/assignment-test/blob/master/image/Keseluruhan%20Arisitektur.png) <br>

diatas merupakan gambaran besar arsitekturnya namun disini saya hanya menggunakan 1 worker node saja untuk menghemat cost.

- 3 EC2 Instance di aws
- HAProxy sebagai load balancer
- Master Node
- 1 Worker Node

# Login Flow

![alt text](https://github.com/Rampo0/assignment-test/blob/master/image/Auth%20Login%20Flow.png) <br>

- User Login menggunakan api "/api/v1/auth/token"
- User menerima response berupa access_token dan refresh_token
- Pada saat login server akan merecord refresh_token dengan lifetime expiration time
- access_token akan expired dalam 5 menit
- Apabila access_token expired third party app misalnya mobile app harus melakukan request ke api "/api/v1/auth/refresh-token" agar aplikasi tidak perlu logout
- Payload api refresh_token berupa refresh_token yg diberikan pada saat login, kemudian server akan mengecek apakah refresh_token terdapat di database, jika iya maka responsenya access_token yang baru
- Harusnya ketika logout refresh_token didelete dari database

# CRUD User Flow

![alt text](https://github.com/Rampo0/assignment-test/blob/master/image/CRUD%20Flow.png) <br>

Flow request seperti gambar diatas yaitu user merequest diterima oleh Load balancer kemudian diterima oleh Ingress NGINX Controller kemudian ingress menyesuaikan prefix untuk diteruskan ke service sesuai prefix.

- User merequest ke prefix api "/api/v1/users"
- Ingress meneruskan ke service users
- Setiap request yang dibuat harus menyertakan header Authorization dengan token format Bearer
- Middleware server akan mengecek token auth apakah user admin atau user biasa
- Menyesuaikan rules, read dapat dilakukan oleh user biasa dan admin, create update delete hanya bisa dilakukan oleh role admin
- Server melakukan aksi CRUD sesuai request dan menyimpan ke database