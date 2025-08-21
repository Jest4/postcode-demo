# Question

Canadian postal codes have the `A1A 1A1` format, and are exclusively numbers and letters with one space separating two triples. Each provinces and territories have their own unique set of prefixes.

| Province Code | Prefixes      | Province/Territory Name |
|---------------|---------------|-------------------------|
| ON            | K, L, M, N, P | Ontario                 |
| MB            | R             | Manitoba                |
| NU            | X0A, X0B, X0C | Nunavut                 |
| NT            | X0E, X0G, X1A | Northwest Territories   |

Using the subset of prefix above:

1. Write a `province_for` method which, given a postal code, returns the province code that corresponds, or `null` if none is found to match.
2. Write a `valid_for` method which, given a postal code and a province code, returns `true` if the postal code is valid for the province, or `false` otherwise.

---


province_for ()
dict prefix as keys
does first 1 exist in dict
if not, does first 3
exist,
when it exists, grab the province


valid_for(postcode, prov)
compare the first 3/1 against the list for the province 
regex match capture first 3 chars against [(a-z)(0-9)a-z]," ",0-9, a-z,09



looking for first 3 in dictionary
if not first, 
look for first

return t/f



province_for(postcode)
map
prefixes : provinces


regex match against (a-z)(0-9)a-z," ",0-9, a-z,09
