# opensteri
Sterilization logger. Open Source (Dental)

## Setting up Raspberry PI
Install the Raspberry PI OS without the desktop environment.
You can use this link to get the Raspberry PI OS image manager: https://www.raspberrypi.com/software/

Once installed, make sure you enable SSH when preparing the SD card.
SSH into the raspberry pi and run
```
sudo apt-get update
sudo apt-get upgrade -y
```

Let's download the godex printer drivers
```
curl https://godex.s3-accelerate.amazonaws.com/GrWmkEezBpxtMrU6x4UcyA.file?v01 --output driver.tar.gz
tar -xvf driver.tar.gz

```

Install node
```
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/nodesource.gpg
NODE_MAJOR=18
echo "deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
sudo apt update
sudo apt install nodejs
```

Redirect 8080 to port 80 to serve the node server
```
sudo apt-get install iptables-persistent
sudo iptables -A PREROUTING -t nat -p tcp --dport 80 -j REDIRECT --to-port 8080
sudo sh -c "iptables-save > /etc/iptables/rules.v4"
sudo sh -c "ip6tables-save > /etc/iptables/rules.v6"
sudo systemctl enable netfilter-persistent
```

Let's make the raspberry pi discoverable on the local network
1.1. Edit the hostname file:

bash
Copy code
sudo nano /etc/hostname
Replace the existing name (raspberrypi) with opensteri.

1.2. Also, update the hosts file:

bash
Copy code
sudo nano /etc/hosts
Find the line with 127.0.1.1 raspberrypi and change raspberrypi to opensteri.

1.3. Restart the Raspberry Pi for changes to take effect:

bash
Copy code
sudo reboot
2. Use mDNS for Name Resolution:
The Multicast Domain Name System (mDNS) allows hosts to be discovered without a central domain name server. This is useful for local networks.

The avahi-daemon service on the Raspberry Pi provides mDNS functionality, allowing the Pi to be reached as opensteri.local from other devices on the same network.

2.1. Install avahi and its utilities:

bash
Copy code
sudo apt-get update
sudo apt-get install avahi-daemon avahi-discover avahi-utils libnss-mdns
2.2. Ensure the avahi-daemon service is running:

bash
Copy code
sudo systemctl enable avahi-daemon
sudo systemctl start avahi-daemon
With the above steps, you should be able to access your Raspberry Pi from other devices on the same local network using http://opensteri.local.

Note: Not all devices support mDNS out of the box. Most Linux distributions and macOS support it natively. For Windows, you might need to install the Bonjour Print Services to enable mDNS.
