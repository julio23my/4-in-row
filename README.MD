## HOW TO SETUP
1.- Enter to api directory

2.- execute `python manage.py create_db`

3.- execute `flask run`

4.- got to web directory and do `yarn start`


5.- for production do yarn build


the following objectives have yet to be completed:

function that stores the movements.
function that verifies the winner.
connection with backend through socket to send the list of moves and board.
send move and receive board.


the goal of this project is to send all kind of data to the backend and perform with python through a search for the winner and set the moves by sending their coordinates for example 0,0 or 4,6. This is a 7x7 matrix. It is expected that the backend can decide which moves to allow due to the restriction of chips that can only be played horizontally.



