Once Cognito created, go to Cognito -> MFA and verification
    - How will a user be able to recover their account?: Email only
    - Which attributes do you want to verify?: Email

Go to Route53 and create a hosted domain there.

Create a certification in ACM 
    - including expertalk.live & *.expertalk.live
    - update CNAME record in Namecheap

[Whenever API Gateway is deleted, following should be performed]
Custom domain name
    - Go to Namecheap and create a CNAME record with
        - Name: staging-api
        - Value: API Gateway URL, 
            Ex: qgtbapky99.execute-api.us-east-2.amazonaws.com

Enable Cors for all the endpoints
