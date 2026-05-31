# Hostinger VPS Deployment

This deployment runs two isolated Football instances on one Hostinger VPS:

- `ltu.ganayragana.cloud` for Lithuania
- `mkd.ganayragana.cloud` for North Macedonia

Each instance has its own frontend, backend, PostgreSQL container, and database volume. Caddy is the only public entry point and automatically manages HTTPS certificates.

## 1. DNS

In Hostinger DNS, create these `A` records for `ganayragana.cloud`:

```text
ltu   A   72.62.114.180
mkd   A   72.62.114.180
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

Set different strong passwords and Hostinger mailbox credentials:

```text
LTU_POSTGRES_PASSWORD=<strong-ltu-db-password>
MKD_POSTGRES_PASSWORD=<strong-mkd-db-password>
EMAIL_USERNAME=<mailbox@your-domain>
EMAIL_PASSWORD=<mailbox-password>
```

The `.env` file must stay on the VPS and must not be committed. The committed `.env.example` only shows the required variable names.

## 4. Match Reminder Email

The backend sends match reminder emails automatically 30 minutes before kick-off to users who have not submitted a guess.

Language is configured per instance in `docker-compose.yml`:

```text
ltu-backend  MATCH_REMINDER_LANGUAGE=lt
mkd-backend  MATCH_REMINDER_LANGUAGE=en
```

The app URL is also configured per instance and is added to the email body:

```text
ltu-backend  APP_URL=https://ltu.ganayragana.cloud
mkd-backend  APP_URL=https://mkd.ganayragana.cloud
```

The backend timezone is configured per instance with `TZ`. Match reminder checks and displayed email times use this timezone:

```text
ltu-backend  TZ=Europe/Vilnius
mkd-backend  TZ=Europe/Skopje
```

Seeded fixture times in `seed-games.csv` are UTC source times. Each backend's `TZ` value controls how those same match instants are stored/displayed for that instance.

To use Hostinger mail:

```text
EMAIL_USERNAME=notifications@your-domain.com
EMAIL_PASSWORD=<the Hostinger mailbox password>
HOSTINGER_MAIL_HOST=smtp.hostinger.com
HOSTINGER_MAIL_PORT=465
```

`HOSTINGER_MAIL_HOST` and `HOSTINGER_MAIL_PORT` are optional because the Compose file defaults to `smtp.hostinger.com:465`.

In Hostinger, create or choose a mailbox for the sender, for example `notifications@your-domain.com`. Use that full mailbox address as `EMAIL_USERNAME` and its mailbox password as `EMAIL_PASSWORD`.

## 5. Firewall

Allow only SSH, HTTP, and HTTPS publicly:

```sh
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

PostgreSQL and backend ports are not published by this Compose file.

## 6. Start

From `/opt/football/deployment/hostinger`:

```sh
docker compose up -d --build
```

Check status:

```sh
docker compose ps
docker compose logs -f caddy
```

## 7. Verify

```sh
curl -I https://ltu.ganayragana.cloud
curl -I https://mkd.ganayragana.cloud
curl https://ltu.ganayragana.cloud/api/version
curl https://mkd.ganayragana.cloud/api/version
```

Creating users or games in one domain should not affect the other domain.

## 8. Backups

Create database dumps from the VPS:

```sh
docker compose exec -T ltu-postgres pg_dump -U football_user football > ltu-football.sql
docker compose exec -T mkd-postgres pg_dump -U football_user football > mkd-football.sql
```

Restore a dump:

```sh
docker compose exec -T ltu-postgres psql -U football_user football < ltu-football.sql
docker compose exec -T mkd-postgres psql -U football_user football < mkd-football.sql
```

## 9. Updates

Pull new code and rebuild:

```sh
cd /opt/football
git pull
cd deployment/hostinger
docker compose up -d --build
```
