FROM php:8.3-apache

WORKDIR /var/www/html

# Enable Apache URL rewriting so .htaccess rules are applied.
RUN a2enmod rewrite \
	&& sed -ri 's/AllowOverride[[:space:]]+None/AllowOverride All/g' /etc/apache2/apache2.conf

COPY . /var/www/html

EXPOSE 80
