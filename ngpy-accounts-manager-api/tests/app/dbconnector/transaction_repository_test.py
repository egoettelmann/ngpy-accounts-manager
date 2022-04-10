
def month_to_quarter(month: int) -> int:
    return int((month - 1) / 3) + 1


def test_month_to_quarter_formula():
    assert month_to_quarter(1) == 1
    assert month_to_quarter(2) == 1
    assert month_to_quarter(3) == 1
    assert month_to_quarter(4) == 2
    assert month_to_quarter(5) == 2
    assert month_to_quarter(6) == 2
    assert month_to_quarter(7) == 3
    assert month_to_quarter(8) == 3
    assert month_to_quarter(9) == 3
    assert month_to_quarter(10) == 4
    assert month_to_quarter(11) == 4
    assert month_to_quarter(12) == 4
