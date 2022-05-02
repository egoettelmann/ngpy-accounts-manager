FROM ubuntu:18.04

WORKDIR /work

# Installing all required tools
RUN apt-get update && \
    apt-get install iproute2 iputils-ping dnsutils net-tools netcat socat -y

# Switching to root user
USER root

# Adding entrypoint script
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Declaring entrypoint
ENTRYPOINT [ "/work/entrypoint.sh" ]

# Adding run script
COPY run.sh .
RUN chmod +x run.sh

# Declaring run script as default command
CMD [ "/work/run.sh" ]
