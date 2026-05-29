#!/bin/bash

function tabulate-by-comma
{
    gsed 's/,,/,-,/g' | column -t -s '',''
}

q '
select 
    name, species
from pokemon.csv 
where generation = 1
' | tabulate-by-comma
