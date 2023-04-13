# Licensing Server Endpoints
## GET /api/licenses
Retrieve a list of all licenses in the system.

##GET /api/licenses/:license
Retrieve the state and expiration date of a specific license.

Parameters
license: The license key to retrieve information for.

##POST /api/activate/:license
Activate a license for a specific machine.

Parameters
license: The license key to activate.

Body
machineId: The ID of the machine to activate the license for.

## POST /api/deactivate/:license
Deactivate a license for a specific machine.

Parameters
license: The license key to deactivate.

Body
machineId: The ID of the machine to deactivate the license for.

## Product Manager Endpoints
POST /api/products
Create a new product.

Body
name: The name of the product to create.

## GET /api/products
Retrieve a list of all products in the system.