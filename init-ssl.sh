#!/bin/bash

domains=(sorana.ch)
email="info@sorana.ch" 
rsa_key_size=4096

# Installation des certificats
certbot certonly --webroot \
  --email $email \
  --agree-tos \
  --no-eff-email \
  --webroot-path=/var/www/certbot \
  -d ${domains[0]}