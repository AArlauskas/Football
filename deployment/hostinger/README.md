# Hostinger VPS Deployment

This deployment runs two isolated Football instances on one Hostinger VPS:

- `first.ganayragana.cloud`
- `second.ganayragana.cloud`

Each instance has its own frontend, backend, PostgreSQL container, and database volume. Caddy is the only public entry point and automatically manages HTTPS certificates.

## 1. DNS

In Hostinger DNS, create these `A` records for `ganayragana.cloud`:

```text
first   A   72.62.114.180
second  A   72.62.114.180
```

Wait until both names resolve to the VPS before starting Caddy certificate issuance.

## 2. VPS Setup

SSH into the VPS, install Docker, and copy or clone this repository:

```sh
ssh root@72.62.114.180
apt update
apt install -y ca-certificates curl git
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
. /etc/os-release
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $VERSION_CODENAME stable" > /etc/apt/sources.list.d/docker.list
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Clone the app:

```sh
mkdir -p /opt
cd /opt
git clone <YOUR_REPOSITORY_URL> football
cd /opt/football/deployment/hostinger
```

If the repository is private, configure SSH deploy keys or copy the project with `scp` instead.

## 3. Secrets

Create the production environment file:

```sh
cp .env.example .env
nano .env
```

Set different strong passwords:

```text
FIRST_POSTGRES_PASSWORD=<strong-first-db-password>
SECOND_POSTGRES_PASSWORD=<strong-second-db-password>
```

## 4. Firewall

Allow only SSH, HTTP, and HTTPS publicly:

```sh
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

PostgreSQL and backend ports are not published by this Compose file.

## 5. Start

From `/opt/football/deployment/hostinger`:

```sh
docker compose up -d --build
```

Check status:

```sh
docker compose ps
docker compose logs -f caddy
```

## 6. Verify

```sh
curl -I https://first.ganayragana.cloud
curl -I https://second.ganayragana.cloud
curl https://first.ganayragana.cloud/api/version
curl https://second.ganayragana.cloud/api/version
```

Creating users or games in one domain should not affect the other domain.

## 7. Backups

Create database dumps from the VPS:

```sh
docker compose exec -T first-postgres pg_dump -U football_user football > first-football.sql
docker compose exec -T second-postgres pg_dump -U football_user football > second-football.sql
```

Restore a dump:

```sh
docker compose exec -T first-postgres psql -U football_user football < first-football.sql
docker compose exec -T second-postgres psql -U football_user football < second-football.sql
```

## 8. Updates

Pull new code and rebuild:

```sh
cd /opt/football
git pull
cd deployment/hostinger
docker compose up -d --build
```
