/**
 * @name SpellCorrector
 * @Object
 *
 * @description Object that handles word variations
 * 
 */
function SpellCorrector(inputElement) {
	var dictionary = new Trie(),
	    suggestion = null,
	    inRoundTwo = false,
	    roundTwo = [],
	    inputElement = inputElement;

	// *** CREATE DICTIONARY *** TEMPORARY ***
	var dict = ["and", "and", "or", "or", "Hello", "Test", "hillary"];
	for (var i = 0; i < dict.length; i++) {
		dictionary.add(dict[i]);
	}

	/**
	 * @name SpellCorrector.suggestSimilarWord
	 * @function
	 *
	 * @description Takes word found at input element, and tests
	 * variations of the word until it finds the most valid word
	 *
	 * @returns {string} suggested alternative
	 */
	this.suggestSimilarWord = function() {
		var inputWord = document.getElementById(inputElement).value;
		roundTwo = [];
		suggestion = null;
		inRoundTwo = false;

		if (inputWord.length > 0) {
			inputWord = inputWord.toLowerCase();
			var initialCheck = dictionary.find(inputWord);
			if (initialCheck != null) return inputWord;
			checkAll(inputWord);
			if (suggestion === null) checkAgain();
		}

		if (suggestion == null) return "No Match";
		else return suggestion.getSubString();

	};

	/**
	 * @name SpellCorrector.checkAgain
	 * @function
	 *
	 * @description reruns checkAll for each word variation
	 * found in the first run through. This keeps variation 
	 * depth to 2, as to keep speed high.
	 */
	var checkAgain = function() {
		inRoundTwo = true;
		for (var i = 0; i < roundTwo.length; i++) {
			checkAll(roundTwo[i]);
		}
	};

	/**
	 * @name SpellCorrector.checkAll
	 * @function
	 *
	 * @description Runs the 4 basic word variations
	 * @param {string} word String to be manipulated
	 */
	var checkAll = function(word) {
		checkInsertion(word);
		checkAlteration(word);
		if (word.length > 1) {
			checkDeletion(word);
			checkTransposition(word);
		}
	};

	/**
	 * @name SpellCorrector.testWordAndSetSuggestion
	 * @function
	 *
	 * @description If depth is 1, add word to array, 
	 * test to see if the word is found in the Trie structure.
	 * 
	 * @param {string} word String to be added and searched for.
	 */
	var testWordAndSetSuggestion = function(word) {
		if ((!inRoundTwo) && (roundTwo.indexOf(word) == -1)) {
			roundTwo.push(word);
		}

		var node = dictionary.find(word);
		if (node != null) setSuggestion(node);
	};

	/**
	 * @name SpellCorrector.checkInsertion
	 * @function
	 *
	 * @description Insert each letter of the alphabet at
	 * each index of the word, and test it.
	 * Example hello -> ahello
	 * 
	 * @param {string} word String to be manipulated
	 */
	var checkInsertion = function(word) {
		for (var i = 0; i <= word.length; i++) {
			for (var j = 0; j < 26; j++) {
				var inserted = word,
					letter = String.fromCharCode(97 + j);
				inserted = inserted.substring(0,i) +
				           letter + inserted.substring(i);
				testWordAndSetSuggestion(inserted);
			}
		}
	};

	/**
	 * @name SpellCorrector.checkDeletion
	 * @function
	 *
	 * @description Delete each letter at each index and test.
	 * Example hello -> ello
	 * 
	 * @param {string} word String to be manipulated
	 */
	var checkDeletion = function(word) {
		for (var i = 0; i < word.length; i++) {
			var deleted = word;
			if (i === 0) deleted = deleted.substring(1);
			else {
				deleted = deleted.substring(0, i) + deleted.substring(i+1);
				if (deleted === "hillary") alert("win");
			}
			testWordAndSetSuggestion(deleted);
		}
	};

	/**
	 * @name SpellCorrector.checkAlteration
	 * @function
	 *
	 * @description Replace each letter of the word with
	 * each letter of the alphabet.
	 * Example hello -> aello
	 * 
	 * @param {string} word String to be manipulated
	 */
	var checkAlteration = function(word) {
		for (var i = 0; i < word.length; i++) {
			for (var j = 0; j < 26; j++) {
				var altered = word,
					letter = String.fromCharCode(97 + j);
				altered = altered.substring(0,i) +
						  letter + altered.substring(i+1);
				testWordAndSetSuggestion(altered);
			}

		}
	};

	/**
	 * @name SpellCorrector.checkTransposition
	 * @function
	 *
	 * @description Swap neighboring letters and test
	 * Example hello -> ehllo
	 * 
	 * @param {string} word String to be manipulated
	 */
	var checkTransposition = function(word) {
		for (var i = 0; i < word.length - 1; i++) {
			var transposed = word,
				temp1 = transposed.charAt(i),
				temp2 = transposed.charAt(i+1);
			transposed = transposed.substring(0,i) +
				temp2 + temp1 + transposed.substring(i+2);
			testWordAndSetSuggestion(transposed);
		}
	};

	/**
	 * @name SpellCorrector.setSuggestion
	 * @function
	 *
	 * @description Set suggestion based on:
	 * 		- Word value
	 * 		- Alphabetical
	 * 
	 * @param {Node} node Node containing possible suggestion
	 */
	var setSuggestion = function(node) {
		if (suggestion == null) {
			suggestion = node;
		}
		if (node.getValue() > suggestion.getValue()) {
			suggestion = node;
		}
		else {
			if (node.getSubString() < suggestion.getSubString()) {
				suggestion = node;
			}
		}
	};
};
