echo "INFO: Executing installation script!"

# Verify that we can at least get version output
if ! docker --version; then
	echo "ERROR: Did Docker get installed?"
	exit 1
fi

echo "INFO: Successfully verified docker installation!"

echo
echo "INFO: Install packages"
cd ./packages/products
npm install

cd ./packages/reviews
npm install

echo

echo "INFO: Mounting Docker containers"
cd ..
cd ..
npm run start:docker

printf "INFO: Successfully executed all the steps to run the microservices application"
read ans