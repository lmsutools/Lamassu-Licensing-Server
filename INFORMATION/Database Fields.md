license_type: Stores the type of license (e.g., 'trial', 'standard', 'enterprise'). This can help differentiate between various plans with different features and pricing.
user_email: Stores the email address of the user who purchased or activated the license. This can be useful for sending notifications or updates related to the license.
purchase_date: Stores the date when the license was purchased. This can be used for invoicing, tracking sales, and calculating revenue.
renewal_date: Stores the date when the license should be renewed. This can be useful for sending renewal reminders and tracking subscription renewals.
max_activations: Stores the maximum number of allowed activations for a license. This can be useful for managing multi-seat licenses or enforcing license restrictions.
current_activations: Stores the current number of active activations for a license. This can help track the usage of multi-seat licenses and ensure that users don't exceed the allowed number of activations.
notes: Stores any additional notes or comments related to the license. This can be helpful for customer support or tracking special circumstances associated with a license.

To use createTable.js without problems from a remote location different than the server IP, we need to access mariadb on the server
sudo mysql -u root -p
Then
GRANT ALL PRIVILEGES ON *.* TO 'root'@'xxx.xxx.xxx.xxx' WITH GRANT OPTION;
Replace the xxx with the remote ip.