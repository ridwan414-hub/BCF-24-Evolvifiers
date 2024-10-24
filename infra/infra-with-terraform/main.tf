# Configure AWS Provider
provider "aws" {
  region = "us-east-2"
}

# Create VPC
resource "aws_vpc" "bcf_24" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "bcf_24"
  }
}

# Create Public Subnet
resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.bcf_24.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "us-east-2a"

  tags = {
    Name = "bcf_24_public_subnet"
  }
}

# Create Internet Gateway
resource "aws_internet_gateway" "bdf_24_igw" {
  vpc_id = aws_vpc.bcf_24.id

  tags = {
    Name = "bdf_24_igw"
  }
}

# Create Route Table
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.bcf_24.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.bdf_24_igw.id
  }

  tags = {
    Name = "bcf_24_public_rt"
  }
}

# Associate Route Table with Subnet
resource "aws_route_table_association" "public_rt_association" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_rt.id
}

# Create Security Group
resource "aws_security_group" "instance_sg" {
  name        = "instance_sg"
  description = "Security group for EC2 instances"
  vpc_id      = aws_vpc.bcf_24.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "bcf_24_sg"
  }
}

# Create Nginx Proxy Instance (t3.small)
resource "aws_instance" "nginx_proxy" {
  ami                    = "ami-0ea3c35c5c3284d82"
  instance_type          = "t3.small"
  subnet_id              = aws_subnet.public_subnet.id
  key_name              = "Key_bcf24"
  vpc_security_group_ids = [aws_security_group.instance_sg.id]

  tags = {
    Name = "nginx-proxy"
  }
}

# Create Kubernetes Cluster Instances (t3.medium)
resource "aws_instance" "k8s_instances" {
  count = 3

  ami                    = "ami-0ea3c35c5c3284d82"
  instance_type          = "t3.medium"
  subnet_id              = aws_subnet.public_subnet.id
  key_name              = "Key_bcf24"
  vpc_security_group_ids = [aws_security_group.instance_sg.id]

  tags = {
    Name = element(["master", "worker-1", "worker-2"], count.index)
  }
}
output "nginx_proxy_public_ip" {
  value = aws_instance.nginx_proxy.public_ip
} 
output "k8s_instances_public_ips" {
  value = aws_instance.k8s_instances[*].public_ip
}
output "k8s_instances_private_ips" {
  value = aws_instance.k8s_instances[*].private_ip
}
output "k8s_instances_private_dns" {
  value = aws_instance.k8s_instances[*].private_dns
}
