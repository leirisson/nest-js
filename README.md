# nest-js
curso de NEST-JS

comando para gerar chave 
Method 2: Using ssh-keygen (if Git is installed)
REM Generate RSA-2048 key pair
ssh-keygen -t rsa -b 2048 -f my_rsa_key -N ""

REM This creates:
REM my_rsa_key (private key)
REM my_rsa_key.pub (public key)

REM View the keys
type my_rsa_key
type my_rsa_key.pub