CREATE TEMPORARY TABLE tmp_debts AS
SELECT CustomerId, SUM(TotalDebt) as SumDebt, MIN(Id) as KeepId
FROM CustomerDebts
GROUP BY CustomerId;

UPDATE CustomerDebts c
JOIN tmp_debts t ON c.Id = t.KeepId
SET c.TotalDebt = t.SumDebt;

DELETE FROM CustomerDebts
WHERE Id NOT IN (SELECT KeepId FROM tmp_debts);

DROP TABLE tmp_debts;
