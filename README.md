# Info
**Admin credentials** <br>
email / username	: admin@sejutacita.id <br>
password			: password

**Postman link** <br>
Gunakan production environment pada postman docs <br>
Gunakan http bukan https <br>
link : [sejutacita api docs](https://documenter.getpostman.com/view/11962530/TVsskUi6)

**Host** <br>
host : ec2-3-238-237-81.compute-1.amazonaws.com <br>

***Note: Deployment sudah dimatikan**

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

# Cluster Setup

Author : Sandip Das

Steps to Install Kubernetes on Ubuntu
Set up Docker

Step 1: Install Docker
Kubernetes requires an existing Docker installation. If you already have Docker installed, skip ahead to Step 2.

If you do not have Kubernetes, install it by following these steps:

1. Update the package list with the command:
sudo apt-get update

2. Next, install Docker with the command:
sudo apt-get install docker.io

3. Repeat the process on each server that will act as a node.

4. Check the installation (and version) by entering the following:
docker version

Step 2: Start and Enable Docker

1. Set Docker to launch at boot by entering the following:
sudo systemctl enable docker

2. Verify Docker is running:
sudo systemctl status docker

To start Docker if it’s not running:
sudo systemctl start docker

3. Repeat on all the other nodes.

Step 3: Install Kubernetes
Since you are downloading Kubernetes from a non-standard repository, it is essential to ensure that the software is authentic. This is done by adding a signing key.

1. Enter the following to add a signing key:

curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add
If you get an error that curl is not installed, install it with:

sudo apt-get install curl
2. Then repeat the previous command to install the signing keys. Repeat for each server node.

Step 4: Add Software Repositories
Kubernetes is not included in the default repositories. To add them, enter the following:

sudo apt-add-repository "deb http://apt.kubernetes.io/ kubernetes-xenial main"
Repeat on each server node.

Step 5: Kubernetes Installation Tools
Kubeadm (Kubernetes Admin) is a tool that helps initialize a cluster. It fast-tracks setup by using community-sourced best practices. Kubelet is the work package, which runs on every node and starts containers. The tool gives you command-line access to clusters.

1. Install Kubernetes tools with the command:

sudo apt-get install kubeadm kubelet kubectl
sudo apt-mark hold kubeadm kubelet kubectl
Allow the process to complete.

2. Verify the installation with:

kubeadm version
3. Repeat for each server node.

Note: Make sure you install the same version of each package on each machine. Different versions can create instability. Also, this process prevents apt from automatically updating Kubernetes. For update instructions, please see the developers’ instructions.

Kubernetes Deployment
Step 6: Begin Kubernetes Deployment
Start by disabling the swap memory on each server:
sudo swapoff –a

Step 7:
On each server, enable the use of iptables 
echo "net.bridge.bridge-nf-call-iptables=1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

Step 8: Initialize Kubernetes on Master Node
Switch to the master server node, and enter the following:

sudo kubeadm init --pod-network-cidr=10.244.0.0/16
Once this command finishes, it will display a kubeadm join message at the end. Make a note of the whole entry. This will be used to join the worker nodes to the cluster.

Next, enter the following to create a directory for the cluster:

kubernetes-master:~$ mkdir -p $HOME/.kube
kubernetes-master:~$ sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
kubernetes-master:~$ sudo chown $(id -u):$(id -g) $HOME/.kube/config

Step 9: Deploy Pod Network to Cluster
A Pod Network is a way to allow communication between different nodes in the cluster. This tutorial uses the flannel virtual network.

Enter the following:

sudo kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
Allow the process to complete.

Verify that everything is running and communicating:
kubectl get pods --all-namespaces

Step 10: Join Worker Node to Cluster
If it's AWS EC2 allow an inbound TCP port 6443 in the master node security group from worker security group or IP (For demo purpose quickly I just enable publicly but you should make sure it's secure)

As indicated in Step 7, you can enter the kubeadm join command on each worker node to connect it to the cluster.

Switch to the worker01 system and enter the command you noted from Step 7:

kubeadm join --discovery-token abcdef.1234567890abcdef --discovery-token-ca-cert-hash sha256:1234..cdef serverip:6443
Replace the alphanumeric codes with those from your master server IP and port. Repeat for each worker node on the cluster. Wait a few minutes; then you can check the status of the nodes.

Switch to the master server, and enter:

kubectl get nodes
The system should display the worker nodes that you joined to the cluster.
