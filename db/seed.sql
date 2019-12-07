-- Has to be seeded with UUID and temporary passwords in order for user to log in for the first time.
-- Nice-to-have: force user to update temporary password after first login

INSERT INTO users (name, address_line1, address_line2, postal_code, city, province, district, UUID, salt, password, hasVoted) VALUES ("Joe Smith", "Unit 802", "12 Main Street", "M1M 1M1", "Toronto", "ON", "E02", "0123456789", "d512dc906ded86ba323632e26858ef85", "b0ba031e04b9fcf34270cdd6280a3bc80f6d6cfe6a0b3e1e14f574ab8d740298ca33589f6459eba2c38e29d943794c5262d58f238ba4c08e30235760b627cb21");