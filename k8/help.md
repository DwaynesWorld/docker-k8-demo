<!-- Get access token -->

k -n kube-system get secret
k -n kube-system describe secrets admin-user-token-6c7bg

<!-- Simulate Request -->

curl http://localhost:81/api/events/1561002378563

k run -i --tty load-generator --image=busybox /bin/sh
while true; do wget -q -o wget.log http://backend-service:81/api/events/1561002378563
