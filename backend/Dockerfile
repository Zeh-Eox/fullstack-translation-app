FROM php:8.3-cli

WORKDIR /var/www

# Installation des dépendances nécessaires et de l'extension SQLite
RUN apt-get update && apt-get install -y \
    unzip \
    zip \
    libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copie des fichiers de l'application
COPY . .

# Installation de Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Installation des dépendances PHP
RUN composer install

# Création du fichier de base de données SQLite si nécessaire
RUN touch database/database.sqlite && chmod 777 database/database.sqlite

# Exposition du port
EXPOSE 8000

# Commande de démarrage
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]