def test_admin_role():

    role = "admin"

    assert role == "admin"



def test_admin_email():

    email = "admin@gmail.com"

    assert "@" in email



def test_dashboard_access():

    is_admin = True

    assert is_admin is True