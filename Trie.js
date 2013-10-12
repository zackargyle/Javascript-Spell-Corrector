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

function Trie() {
	var wordCount = 0,
		nodeCount = 1,
		childNodes = new Array(26);

	this.getWordCount = function() {
		return wordCount;
	};

	this.getNodeCount = function() {
		return nodeCount;
	};

	/**
	 * @name Trie.add
	 * @function
	 *
	 * @description Adds a string to the Trie dictionary
	 * @param {string} word String to be added
	 */
	this.add = function(word) {
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
	};

	/**
	 * @name Trie.find
	 * @function
	 *
	 * @description Finds string in Trie
	 * @param {string} word String to be found
	 * @returns {Node} Node matching string, or null
	 */
	this.find = function(word) {
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
	};

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

}

