# Variables for public key and instance type
variable "ssh_public_key" {
  description = "Public key for SSH access"
  type        = string
}

variable "instance_type" {
  description = "Instance type for the EC2 instance"
  type        = string
  default     = "t2.micro"
}