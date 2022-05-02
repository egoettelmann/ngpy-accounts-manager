#!/bin/bash

# Variables
DELAY_MS=6000
DELAY_VAR_MS=0
DELAY_DECR_MS=1000
DELAY_DECR_FREQ_MS=5000

# Run the "exit" command when receiving SIGNAL
trap "exit" SIGINT
trap "exit" SIGTERM

# Using traffic control to create delay
echo "Adding delay of ${DELAY_MS}ms (var=${DELAY_VAR_MS}ms)"
tc qdisc add dev eth0 root netem delay "${DELAY_MS}ms" "${DELAY_VAR_MS}ms"

# Reducing delay periodically
while :; do
  sleep $(($DELAY_DECR_FREQ_MS / 1000)) &
  wait $!
  DELAY_MS=$(($DELAY_MS - $DELAY_DECR_MS))
  if [ "$DELAY_MS" -le "0" ]; then
    tc qdisc del dev eth0 root netem
    echo "Delay reduced to 0"
    break
  fi
  echo "Changing delay to ${DELAY_MS}ms (var=${DELAY_VAR_MS}ms)"
  tc qdisc change dev eth0 root netem delay "${DELAY_MS}ms" "${DELAY_VAR_MS}ms"
done

# change to random delay
# tc qdisc change dev eth0 root netem delay 100ms 10ms

# delete
# tc qdisc del dev eth0 root netem

# add 250ms delay
# tc qdisc add dev eth0 root netem delay 250ms

# add random delay
# tc qdisc add dev eth0 root netem delay 100ms 10ms

# Keep the container running
while :; do
  sleep 1 &
  wait $!
done
