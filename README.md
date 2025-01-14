# LNVPN - A Very Different VPN - Privacy by Design - THE Bitcoin VPN

Select a country ➡️ Select duration ➡️ Pay with Lightning ➡️ Use your VPN

LNVPN is a privacy focused VPN provider. We accept only Lightning payments. 

<img width="876" alt="Screenshot 2024-10-08 at 09 22 47" src="https://github.com/user-attachments/assets/d97124f8-e63f-4da3-acfb-0020fee48322">

# How does it work?


Very simple: On this website you automatically generate WireGuard VPN keys via JavaScript inside of your browser. After selecting a country where your VPN endpoint should be located and a desired validity of your connection you click "Get Invoice" to get a QR code which you can scan with a Bitcoin Lightning capable wallet like Phoenix, Muun, Breez or BlueWallet. 

After a successful payment, the website reloads and presents you a new QR code and the message PAID. You can now scan the QR code with the WireGuard App on Android Google Play or on the Apple App Store. If you want to use the VPN connection on your PC or Mac you can download the WireGuard configuration file to import it into WireGuard for Windows and MacOS. You can as well send the configuration to yourself via Email to use it later on another device.



# What data do you store about your users? How anonymous is this? What privacy do you offer?

On the lnvpn.net website, we don't use cookies and we only store the first half of your ip address in our webserver logs. For example the IP 1.12.123.234 would be stored as 1.12.0.0. On the VPN endpoints we store your WireGuard public key, the PSK and the total amount of bandwidth you used. 

While you're connected to our VPN, the endpoint temporarily keeps your IP address in memory to maintain the connection. If there's no activity for 5 minutes, the IP address is automatically deleted. We never store it on any disk or permanent storage. As payments are only possible via Bitcoin Lightning, we don't know where the money comes from, we can only verify whether an invoice was paid or not 🤷. If you use the "Send via email" feature for your WireGuard configuration, the email is send via Sendgrid.

# What happens after the timeframe I paid my VPN for?

You won't be able to transfer any data over the VPN connection anymore. Your VPN client may indicate it is successfully connected, though.

# Is there a data transfer limit?

Currently, we have five data plans:

    1 hour = 10GB
    1 day = 50GB
    1 week = 150GB
    1 month = 300GB
    3 months (1 quarter) = 800GB


# Can I use this VPN for my Lightning Node?

If you need a VPN for your Lightning Node visit tunnelsats.com.

# Who build this?

Berlin Bitcoiners

# We offer also one time usage telephone numbers now. 

Receive service activations in a few clicks, anonymously 🎉
1. Pick a Country & Service
2. Pay the Lightning Network invoice
3. Receive the SMS you requested.

Note that if you have not received an SMS code successfully, your payment will be canceled automatically and funds will return to your wallet. No refund needed!

