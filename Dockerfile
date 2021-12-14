FROM alpine:3 AS base
RUN apk add --update nodejs npm

FROM base AS builder

ARG IBMID_CLIENT_ID
ARG IBMID_CLIENT_SECRET
ARG MONGODB_URI

WORKDIR /usr/app

COPY converter/textbook-converter/requirements.txt converter/textbook-converter/
# py3-pyzmq is needed by pyyaml but pip is not able to compile it.
RUN apk add --no-cache g++ linux-headers python3 python3-dev py3-pip py3-pyzmq
RUN python3 -m venv .venv && source .venv/bin/activate
RUN python3 -m pip install -U pip \
  && python3 -m pip install -r converter/textbook-converter/requirements.txt

COPY package*.json ./
COPY patches patches/
RUN npm ci
# the ci is not triggering the postinstall
RUN npm run patch

COPY converter converter/
COPY frontend frontend/
COPY server server/
COPY notebooks notebooks/
COPY translations translations/
COPY config.yaml ./

RUN npm run setup:secrets -- --mongo $MONGODB_URI --ibmClientId $IBMID_CLIENT_ID --ibmClientSecret $IBMID_CLIENT_SECRET

RUN npm run build
# only need to keep all the strings.yaml
RUN find ./translations -type f ! -iname "*.yaml" -delete

FROM base
WORKDIR /usr/app

COPY --from=builder /usr/app/package*.json ./
COPY --from=builder /usr/app/patches patches/
# npm ci --production is not working for some unknown reason
RUN npm install
# the ci is not triggering the postinstall
RUN npm run patch
COPY --from=builder /usr/app/server server/
COPY --from=builder /usr/app/config.yaml ./
COPY --from=builder /usr/app/public public/
COPY --from=builder /usr/app/frontend frontend/
COPY --from=builder /usr/app/notebooks/toc.yaml notebooks/
COPY --from=builder /usr/app/working working/
COPY --from=builder /usr/app/translations translations/

CMD ["npm", "start"]
