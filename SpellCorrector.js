/**
 * @name Trie
 * @Object
 *
 * @description
 * A Trie is a data structure that has 26 children (nodes) corresponding
 * to the letters of the alphabet (for quick hashing)
 *
 * Each child has 26 children
 * "a" corresponds to childNodes[0], "c" to childNodes[2]...

 * Adding is done by using the first letter of the word as an index,
 * popping it off the string, creating (if necessary) or moving to the
 * specified node, and repeating until the string is empty. At this point
 * the node value is increased to show it is a valid word, not part of a word.
 *
 * Finding is done by using the first letter of the word as an index,
 * popping it off the string, moving to the corresponding Node, and
 * repeating the process until the corresponding node is null or the word
 * matches the node substring
 * 
 */

var Trie = (function() {
	var wordCount = 0,
		nodeCount = 1,
		childNodes = new Array(26);

	/**
	 * The child nodes of a Trie
	 * Functionality is like that of its parent.
	 */
	
	function Node(substring) {
		var value = 0,
			nodeSubstring = substring,
			nodes = new Array(26);

		this.getValue = function() {
			return value;
		};
			
		this.incrementValue = function() {
			value++;
		};
			
		this.getSubString = function() {
			return nodeSubstring;
		};

		this.getNodes = function() {
			return nodes;
		};

		/**
		 * @name Node.add
		 * @function
		 *
		 * @description Adds Nodes for word
		 * @param {string} word String to be added
		 */
		this.add = function(word) {
			var index = word.charCodeAt(0) - 97;
			if (nodes[index] == null) {
				nodes[index] = new Node(nodeSubstring+word.charAt(0));
				nodeCount++;
			}
			if (word.length > 1) {
				nodes[index].add(word.substring(1));
			}
			else {
				if (nodes[index].getValue() === 0) wordCount++;
				nodes[index].incrementValue();
			}
		};

		/**
		 * @name Node.find
		 * @function
		 *
		 * @description Find word within node or children
		 * @param {string} word, Full string to be found
		 * @param {string} substring, remaining string
		 * @returns {Node} Corresponding node or null
		 */
		this.find = function(word, substring) {
			if (nodeSubstring === word) {
				// Is a valid word, not part of a word
				if (value > 0) return this;
				else return null;
			}
			else if (substring.length === 0) {
				return null
			}
			else {
				var index = substring.charCodeAt(0) - 97;
				if (nodes[index] == null) {
					return null;
				}
				else {
					var sub = substring.substring(1);
					return nodes[index].find(word, sub);
				}
			}
		};
	}

	return {
		getWordCount : function() {
			return wordCount;
		},

		getNodeCount : function() {
			return nodeCount;
		},

		/**
		 * @name Trie.add
		 * @function
		 *
		 * @description Adds a string to the Trie dictionary
		 * @param {string} word String to be added
		 */
		add : function(word) {
			word = word.toLowerCase();
			var index = word.charCodeAt(0) - 97;

			if (childNodes[index] == null) {
				childNodes[index] = new Node(word.charAt(0));
				nodeCount++;
			}

			if (word.length > 1) {
				var substring = word.substring(1);
				childNodes[index].add(substring);
			}
			else if (word.length == 1) {
				childNodes[index].incrementValue();
				wordCount++;
			}
		},

		/**
		 * @name Trie.find
		 * @function
		 *
		 * @description Finds string in Trie
		 * @param {string} word String to be found
		 * @returns {Node} Node matching string, or null
		 */
		find : function(word) {
			word = word.toLowerCase();
			var index = word.charCodeAt(0) - 97;
			if (word.length > 1) {
				if (childNodes[index] == null) return null;
				else {
					var substring = word.substring(1);
					return childNodes[index].find(word, substring);
				}
			}
			else if (word.length === 1) {
				if (childNodes[index] != null && childNodes[index].getValue() > 0) {
					return childNodes[index];
				}
			}
			return null;
		}
	};

}());



/**
 * @name SpellCorrector
 * @Object
 *
 * @description Object that handles word variations
 * 
 */
var SpellCorrector = (function() {
	var dictionary = Trie,
	    suggestion = null,
	    inRoundTwo = false,
	    roundTwo = [];

	// *** CREATE DICTIONARY *** TEMPORARY ***
	var dict = ["and", "and", "or", "or", "Hello", "Test", "hillary", "nathan", "awesome"];
	for (var i = 0; i < dict.length; i++) {
		dictionary.add(dict[i]);
	}

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

	/**
	 * @name SpellCorrector.suggestSimilarWord
	 * @function
	 *
	 * @description Takes word found at input element, and tests
	 * variations of the word until it finds the most valid word
	 *
	 * @returns {string} suggested alternative
	 */
	return {
		suggestSimilarWord : function(inputID, outputID) {
			if (typeof(inputID) != "string" || typeof(outputID) != "string")  {
				console.log("suggestSimilarWord() takes strings as parameters.");
				return;
			}
			var inputElement = document.getElementById(inputID);
			var outputElement = document.getElementById(outputID);
			if (!inputElement || !outputElement) {
				console.log("Incorrect element id");
				return;
			}

			roundTwo = [];
			suggestion = null;
			inRoundTwo = false;

			var inputWord = inputElement.value.toLowerCase();

			if (inputWord.length > 0) {
				if (dictionary.find(inputWord)) return inputWord;
				checkAll(inputWord);
				if (suggestion === null) checkAgain();
			}

			if (suggestion == null) {
				outputElement.value = "";
				return "";
			}
			else {
				outputElement.innerHTML = suggestion.getSubString();
				return suggestion.getSubString();
			}
		}
	};
}());
