# Solitaire
Project goal: find the win rate of Solitaire using a simple algorithm and experiment with some variation.

Background: Solitaire (specifically the version known as Klondike) presents an interesting mathematical puzzle. The probability of a game being winnable has been calculated to be about 82% (source wiki lol), but this assumes a perfect player with complete knowledge of the cards that are turned over. I was unable to find much info about a normal player's win rate with incomplete information of the game. There are also some variations to the rules that would put any numbers I find on the internet questionable to the game we know, so I decided this would be the topic for my next programming project.

Methodology: Find the rate empirically through brute force via a computer program. Make a graphical user interface first for easier testing and for flashiness. Also apply what I've been learning about statistics to analyze the data.

Details: There are two sets of specifications that need to be defined before appreciating the results.

The first specification is the rules of the game. The first rule is how many cards are turned over at a time. This is either 3 or 1. It seems that the rule we made that lets us transition from 3 to 1 when the hand gets to 7 cards is unique to our family as I didn't see it mentioned anywhere. Ultimately I decided to test all 3 versions of this rule: draw 3, draw 3 then 1, and draw 1.
The second rule variation is how many times the player is allowed to go through the hand. I didn't know this limit existed as we have always allowed infinite passes through the hand. Apparently the default rule is to only allow 3 passes. I thought this was too un-fun, so I only tested the infinite passes version.

The second specification in how the algorithm that is playing the game actually works. This one is a lot less discrete, but I programmed it in a simple and logical way similar to how I go about the game. Nothing too try-hard. Here is the priority it takes for each move:
1) If there is an unrevealed stack, reveal the top card immediately.
2) If it can put up a low card with no risk of needing it from the stacks or the currently visible hand card, then put it up. It decides if it is ok to put up by looking at the lowest value in the Up Stacks and adding 2. If the card value is less than or equal to this value, then it is ok to put up. For example, at the start of the game, it will immediately put up Aces and 2s because the lowest value in the Up Stacks is 0. If all the aces are up, then it will put up 2s and 3s.
3) It checks the main stacks to see if any moves can be made in between them. At first I kept it simple and used a simple double for loop starting at the first (left stack, but later I realized that it is better to prioritize the right side to start picking away at the large piles of overturned cards. I decided to test both of these approaches.
4) It checks if the currently visible card in the hand can go to the stack. I don't think the stack it goes to matters in this case, so I just sent it to the first possible stack from the left.
5) Next it checks if any cards on top of the main stacks can go up. If any of these possible moves were passed over in step 2, then now is the time they go up.
6) It checks if the visible card in the hand can go up
7) Finally, it turns the hand to reveal the next card in the hand

If it went through the hand twice without doing a single move, then it concludes that it lost that game. It checks if it won by simply checking if the minimum value in the Up Stacks is 13 (Kings).

This generally mimics the casual Solitaire player's strategy by loosely prioritizing
moving between stacks first and holding off putting cards up right away in case they are needed later. I separated the AI into its own class so anyone wanting to test a different algorithm on a fork of this project can just make an AI2.js and use that instead.

Statistical validity:
In order to conduct an inference on the true mean of winning a game this test must pass three conditions: 
1) Random test: Check. The cards were randomly generated by making an array with the numbers 0-51. The array was then randomly shuffled before being sorted into the various data arrays that represented the game. Computer random number generators are generally considered to be good enough.
2) The sample mean distribution should follow a normal bell curve: Check. For estimating proportions (probability), the number of tests should be high enough to expect more than 10 successes and failures. These tests clearly exceed that.
3) There must be independent observations: Check. Independent observations mean that there is no chance that trying one configuration affects the chance of future games of winning. This is easily achieved if you are sampling with replacement (letting it be possible to check the same configuration). I am in fact sampling with replacement as it is possible to randomly test the exact same card configuration out of the 52! different starting configurations.

Results:
I ran each test over 10,000 games. The Margin of Error uses a 99% confidence interval (chance of the true mean actually being within it). Here are the win rates over different rules:
Focusing on the left piles first:
draw 3:7.4% +/- 0.67%
draw 3 then 1 after 7 cards left:12.64% +/- 0.86%
draw 1:30.25% +/- 1.18%

Focusing on the right piles first:
draw 3:10.43% +/- 0.79%
draw 3 then 1 after 7 cards left:16.28% +/- 0.95%
draw 1:37.76% +/- 1.25%

The statistic that most correlates to my Solitaire games is the second to last one: 16.28%. A simple take-away from all this is that I have a roughly 1 in 6 chance of winning Solitaire.

Another interesting observation is that Focusing on the right piles results in about a 25-40 percent increase (multiplicative) to the win rate. This is one of the simplest optimizations that could be made, but there are probably more.
