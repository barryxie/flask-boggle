from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):
    def setUp(self) -> None:
        self.client = app.test_client()

    def test_homepage(self):
        with self.client as client:
            res = client.get('/')
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code, 200)
            self.assertIn('board', session)
            self.assertIsNone(session.get('highscore'))
            self.assertIsNone(session.get('nplays'))
            self.assertIn('<p>High Score:', html)
            self.assertIn('Score:', html)
            self.assertIn('Seconds Left:', html)

    def test_valid_word(self):
        """Test if word is valid by modifying the board in the session"""
        
        with self.client as client:
            with client.session_transaction() as sess:
                sess['board'] = [["C", "A", "T", "T", "T"], 
                                 ["C", "A", "T", "T", "T"], 
                                 ["C", "A", "T", "T", "T"], 
                                 ["C", "A", "T", "T", "T"], 
                                 ["C", "A", "T", "T", "T"]]
        res = self.client.get('/check-word?word=cat')
        self.assertEqual(res.json['result'], 'ok')                            

    def test_invalid_word(self):
        self.client.get('/')
        res = self.client.get('/check-word?word=impossible')
        self.assertEqual(res.json['result'], 'not-on-board')

    def test_not_word(self):  
        self.client.get('/')
        res = self.client.get('/check-word?word=dsfdfsdfasadfadfdfadfdf')
        self.assertEqual(res.json['result'], 'not-word')             
            
    

