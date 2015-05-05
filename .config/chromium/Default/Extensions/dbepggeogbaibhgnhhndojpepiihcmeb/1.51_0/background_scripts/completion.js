// Generated by CoffeeScript 1.9.1
(function() {
  var BookmarkCompleter, DomainCompleter, HistoryCache, HistoryCompleter, MultiCompleter, RankingUtils, RegexpCache, SearchEngineCompleter, Suggestion, TabCompleter, TabRecency, root, tabRecency,
    slice = [].slice;

  Suggestion = (function() {
    Suggestion.prototype.showRelevancy = false;

    function Suggestion(queryTerms1, type1, url1, title1, computeRelevancyFunction, extraRelevancyData) {
      this.queryTerms = queryTerms1;
      this.type = type1;
      this.url = url1;
      this.title = title1;
      this.computeRelevancyFunction = computeRelevancyFunction;
      this.extraRelevancyData = extraRelevancyData;
      this.title || (this.title = "");
      this.autoSelect = false;
    }

    Suggestion.prototype.computeRelevancy = function() {
      return this.relevancy = this.computeRelevancyFunction(this);
    };

    Suggestion.prototype.generateHtml = function() {
      var relevancyHtml;
      if (this.html) {
        return this.html;
      }
      relevancyHtml = this.showRelevancy ? "<span class='relevancy'>" + (this.computeRelevancy()) + "</span>" : "";
      return this.html = "<div class=\"vimiumReset vomnibarTopHalf\">\n   <span class=\"vimiumReset vomnibarSource\">" + this.type + "</span>\n   <span class=\"vimiumReset vomnibarTitle\">" + (this.highlightTerms(Utils.escapeHtml(this.title))) + "</span>\n </div>\n <div class=\"vimiumReset vomnibarBottomHalf\">\n  <span class=\"vimiumReset vomnibarUrl\">" + (this.shortenUrl(this.highlightTerms(Utils.escapeHtml(this.url)))) + "</span>\n  " + relevancyHtml + "\n</div>";
    };

    Suggestion.prototype.getUrlRoot = function(url) {
      var a;
      a = document.createElement('a');
      a.href = url;
      return a.protocol + "//" + a.hostname;
    };

    Suggestion.prototype.shortenUrl = function(url) {
      return this.stripTrailingSlash(url).replace(/^https?:\/\//, "");
    };

    Suggestion.prototype.stripTrailingSlash = function(url) {
      if (url[url.length - 1] === "/") {
        url = url.substring(url, url.length - 1);
      }
      return url;
    };

    Suggestion.prototype.pushMatchingRanges = function(string, term, ranges) {
      var index, j, matchedText, ref, results1, splits, textPosition, unmatchedText;
      textPosition = 0;
      splits = string.split(RegexpCache.get(term, "(", ")"));
      results1 = [];
      for (index = j = 0, ref = splits.length - 2; j <= ref; index = j += 2) {
        unmatchedText = splits[index];
        matchedText = splits[index + 1];
        textPosition += unmatchedText.length;
        ranges.push([textPosition, textPosition + matchedText.length]);
        results1.push(textPosition += matchedText.length);
      }
      return results1;
    };

    Suggestion.prototype.highlightTerms = function(string) {
      var end, escapedTerms, j, k, len, len1, ranges, ref, start, term;
      ranges = [];
      escapedTerms = this.queryTerms.map(function(term) {
        return Utils.escapeHtml(term);
      });
      for (j = 0, len = escapedTerms.length; j < len; j++) {
        term = escapedTerms[j];
        this.pushMatchingRanges(string, term, ranges);
      }
      if (ranges.length === 0) {
        return string;
      }
      ranges = this.mergeRanges(ranges.sort(function(a, b) {
        return a[0] - b[0];
      }));
      ranges = ranges.sort(function(a, b) {
        return b[0] - a[0];
      });
      for (k = 0, len1 = ranges.length; k < len1; k++) {
        ref = ranges[k], start = ref[0], end = ref[1];
        string = string.substring(0, start) + ("<span class='vomnibarMatch'>" + (string.substring(start, end)) + "</span>") + string.substring(end);
      }
      return string;
    };

    Suggestion.prototype.mergeRanges = function(ranges) {
      var mergedRanges, previous;
      previous = ranges.shift();
      mergedRanges = [previous];
      ranges.forEach(function(range) {
        if (previous[1] >= range[0]) {
          return previous[1] = Math.max(range[1], previous[1]);
        } else {
          mergedRanges.push(range);
          return previous = range;
        }
      });
      return mergedRanges;
    };

    return Suggestion;

  })();

  BookmarkCompleter = (function() {
    function BookmarkCompleter() {}

    BookmarkCompleter.prototype.folderSeparator = "/";

    BookmarkCompleter.prototype.currentSearch = null;

    BookmarkCompleter.prototype.bookmarks = null;

    BookmarkCompleter.prototype.filter = function(queryTerms1, onComplete1) {
      this.queryTerms = queryTerms1;
      this.onComplete = onComplete1;
      this.currentSearch = {
        queryTerms: this.queryTerms,
        onComplete: this.onComplete
      };
      if (this.bookmarks) {
        return this.performSearch();
      }
    };

    BookmarkCompleter.prototype.onBookmarksLoaded = function() {
      if (this.currentSearch) {
        return this.performSearch();
      }
    };

    BookmarkCompleter.prototype.performSearch = function() {
      var onComplete, results, suggestions, usePathAndTitle;
      usePathAndTitle = this.currentSearch.queryTerms.reduce(((function(_this) {
        return function(prev, term) {
          return prev || term.indexOf(_this.folderSeparator) === 0;
        };
      })(this)), false);
      results = this.currentSearch.queryTerms.length > 0 ? this.bookmarks.filter((function(_this) {
        return function(bookmark) {
          var suggestionTitle;
          suggestionTitle = usePathAndTitle ? bookmark.pathAndTitle : bookmark.title;
          return RankingUtils.matches(_this.currentSearch.queryTerms, bookmark.url, suggestionTitle);
        };
      })(this)) : [];
      suggestions = results.map((function(_this) {
        return function(bookmark) {
          var suggestionTitle;
          suggestionTitle = usePathAndTitle ? bookmark.pathAndTitle : bookmark.title;
          return new Suggestion(_this.currentSearch.queryTerms, "bookmark", bookmark.url, suggestionTitle, _this.computeRelevancy);
        };
      })(this));
      onComplete = this.currentSearch.onComplete;
      this.currentSearch = null;
      return onComplete(suggestions);
    };

    BookmarkCompleter.prototype.refresh = function() {
      this.bookmarks = null;
      return chrome.bookmarks.getTree((function(_this) {
        return function(bookmarks) {
          _this.bookmarks = _this.traverseBookmarks(bookmarks).filter(function(bookmark) {
            return bookmark.url != null;
          });
          return _this.onBookmarksLoaded();
        };
      })(this));
    };

    BookmarkCompleter.prototype.ignoreTopLevel = {
      'Other Bookmarks': true,
      'Mobile Bookmarks': true,
      'Bookmarks Bar': true
    };

    BookmarkCompleter.prototype.traverseBookmarks = function(bookmarks) {
      var results;
      results = [];
      bookmarks.forEach((function(_this) {
        return function(folder) {
          return _this.traverseBookmarksRecursive(folder, results);
        };
      })(this));
      return results;
    };

    BookmarkCompleter.prototype.traverseBookmarksRecursive = function(bookmark, results, parent) {
      if (parent == null) {
        parent = {
          pathAndTitle: ""
        };
      }
      bookmark.pathAndTitle = bookmark.title && !(parent.pathAndTitle === "" && this.ignoreTopLevel[bookmark.title]) ? parent.pathAndTitle + this.folderSeparator + bookmark.title : parent.pathAndTitle;
      results.push(bookmark);
      if (bookmark.children) {
        return bookmark.children.forEach((function(_this) {
          return function(child) {
            return _this.traverseBookmarksRecursive(child, results, bookmark);
          };
        })(this));
      }
    };

    BookmarkCompleter.prototype.computeRelevancy = function(suggestion) {
      return RankingUtils.wordRelevancy(suggestion.queryTerms, suggestion.url, suggestion.title);
    };

    return BookmarkCompleter;

  })();

  HistoryCompleter = (function() {
    function HistoryCompleter() {}

    HistoryCompleter.prototype.filter = function(queryTerms, onComplete) {
      var results;
      this.currentSearch = {
        queryTerms: this.queryTerms,
        onComplete: this.onComplete
      };
      results = [];
      return HistoryCache.use((function(_this) {
        return function(history) {
          var suggestions;
          results = queryTerms.length > 0 ? history.filter(function(entry) {
            return RankingUtils.matches(queryTerms, entry.url, entry.title);
          }) : [];
          suggestions = results.map(function(entry) {
            return new Suggestion(queryTerms, "history", entry.url, entry.title, _this.computeRelevancy, entry);
          });
          return onComplete(suggestions);
        };
      })(this));
    };

    HistoryCompleter.prototype.computeRelevancy = function(suggestion) {
      var historyEntry, recencyScore, score, wordRelevancy;
      historyEntry = suggestion.extraRelevancyData;
      recencyScore = RankingUtils.recencyScore(historyEntry.lastVisitTime);
      wordRelevancy = RankingUtils.wordRelevancy(suggestion.queryTerms, suggestion.url, suggestion.title);
      return score = (wordRelevancy + Math.max(recencyScore, wordRelevancy)) / 2;
    };

    HistoryCompleter.prototype.refresh = function() {};

    return HistoryCompleter;

  })();

  DomainCompleter = (function() {
    function DomainCompleter() {}

    DomainCompleter.prototype.domains = null;

    DomainCompleter.prototype.filter = function(queryTerms, onComplete) {
      if (queryTerms.length !== 1) {
        return onComplete([]);
      }
      if (this.domains) {
        return this.performSearch(queryTerms, onComplete);
      } else {
        return this.populateDomains((function(_this) {
          return function() {
            return _this.performSearch(queryTerms, onComplete);
          };
        })(this));
      }
    };

    DomainCompleter.prototype.performSearch = function(queryTerms, onComplete) {
      var domain, domainCandidates, domains, query, topDomain;
      query = queryTerms[0];
      domainCandidates = (function() {
        var results1;
        results1 = [];
        for (domain in this.domains) {
          if (domain.indexOf(query) >= 0) {
            results1.push(domain);
          }
        }
        return results1;
      }).call(this);
      domains = this.sortDomainsByRelevancy(queryTerms, domainCandidates);
      if (domains.length === 0) {
        return onComplete([]);
      }
      topDomain = domains[0][0];
      return onComplete([new Suggestion(queryTerms, "domain", topDomain, null, this.computeRelevancy)]);
    };

    DomainCompleter.prototype.sortDomainsByRelevancy = function(queryTerms, domainCandidates) {
      var domain, j, len, recencyScore, results, score, wordRelevancy;
      results = [];
      for (j = 0, len = domainCandidates.length; j < len; j++) {
        domain = domainCandidates[j];
        recencyScore = RankingUtils.recencyScore(this.domains[domain].entry.lastVisitTime || 0);
        wordRelevancy = RankingUtils.wordRelevancy(queryTerms, domain, null);
        score = (wordRelevancy + Math.max(recencyScore, wordRelevancy)) / 2;
        results.push([domain, score]);
      }
      results.sort(function(a, b) {
        return b[1] - a[1];
      });
      return results;
    };

    DomainCompleter.prototype.populateDomains = function(onComplete) {
      return HistoryCache.use((function(_this) {
        return function(history) {
          _this.domains = {};
          history.forEach(function(entry) {
            return _this.onPageVisited(entry);
          });
          chrome.history.onVisited.addListener(_this.onPageVisited.bind(_this));
          chrome.history.onVisitRemoved.addListener(_this.onVisitRemoved.bind(_this));
          return onComplete();
        };
      })(this));
    };

    DomainCompleter.prototype.onPageVisited = function(newPage) {
      var base, domain, slot;
      domain = this.parseDomainAndScheme(newPage.url);
      if (domain) {
        slot = (base = this.domains)[domain] || (base[domain] = {
          entry: newPage,
          referenceCount: 0
        });
        if (slot.entry.lastVisitTime < newPage.lastVisitTime) {
          slot.entry = newPage;
        }
        return slot.referenceCount += 1;
      }
    };

    DomainCompleter.prototype.onVisitRemoved = function(toRemove) {
      if (toRemove.allHistory) {
        return this.domains = {};
      } else {
        return toRemove.urls.forEach((function(_this) {
          return function(url) {
            var domain;
            domain = _this.parseDomainAndScheme(url);
            if (domain && _this.domains[domain] && (_this.domains[domain].referenceCount -= 1) === 0) {
              return delete _this.domains[domain];
            }
          };
        })(this));
      }
    };

    DomainCompleter.prototype.parseDomainAndScheme = function(url) {
      return Utils.hasFullUrlPrefix(url) && !Utils.hasChromePrefix(url) && url.split("/", 3).join("/");
    };

    DomainCompleter.prototype.computeRelevancy = function() {
      return 1;
    };

    return DomainCompleter;

  })();

  TabRecency = (function() {
    TabRecency.prototype.timestamp = 1;

    TabRecency.prototype.current = -1;

    TabRecency.prototype.cache = {};

    TabRecency.prototype.lastVisited = null;

    TabRecency.prototype.lastVisitedTime = null;

    TabRecency.prototype.timeDelta = 500;

    function TabRecency() {
      chrome.tabs.onActivated.addListener((function(_this) {
        return function(activeInfo) {
          return _this.register(activeInfo.tabId);
        };
      })(this));
      chrome.tabs.onRemoved.addListener((function(_this) {
        return function(tabId) {
          return _this.deregister(tabId);
        };
      })(this));
      chrome.tabs.onReplaced.addListener((function(_this) {
        return function(addedTabId, removedTabId) {
          _this.deregister(removedTabId);
          return _this.register(addedTabId);
        };
      })(this));
    }

    TabRecency.prototype.register = function(tabId) {
      var currentTime;
      currentTime = new Date();
      if ((this.lastVisitedTime != null) && this.timeDelta <= currentTime - this.lastVisitedTime) {
        this.cache[this.lastVisited] = ++this.timestamp;
      }
      this.current = this.lastVisited = tabId;
      return this.lastVisitedTime = currentTime;
    };

    TabRecency.prototype.deregister = function(tabId) {
      if (tabId === this.lastVisited) {
        this.lastVisited = this.lastVisitedTime = null;
      }
      return delete this.cache[tabId];
    };

    TabRecency.prototype.recencyScore = function(tabId) {
      var base;
      (base = this.cache)[tabId] || (base[tabId] = 1);
      if (tabId === this.current) {
        return 0.0;
      } else {
        return this.cache[tabId] / this.timestamp;
      }
    };

    return TabRecency;

  })();

  tabRecency = new TabRecency();

  TabCompleter = (function() {
    function TabCompleter() {}

    TabCompleter.prototype.filter = function(queryTerms, onComplete) {
      return chrome.tabs.query({}, (function(_this) {
        return function(tabs) {
          var results, suggestions;
          results = tabs.filter(function(tab) {
            return RankingUtils.matches(queryTerms, tab.url, tab.title);
          });
          suggestions = results.map(function(tab) {
            var suggestion;
            suggestion = new Suggestion(queryTerms, "tab", tab.url, tab.title, _this.computeRelevancy);
            suggestion.tabId = tab.id;
            return suggestion;
          });
          return onComplete(suggestions);
        };
      })(this));
    };

    TabCompleter.prototype.computeRelevancy = function(suggestion) {
      if (suggestion.queryTerms.length) {
        return RankingUtils.wordRelevancy(suggestion.queryTerms, suggestion.url, suggestion.title);
      } else {
        return tabRecency.recencyScore(suggestion.tabId);
      }
    };

    return TabCompleter;

  })();

  SearchEngineCompleter = (function() {
    function SearchEngineCompleter() {}

    SearchEngineCompleter.prototype.searchEngines = {};

    SearchEngineCompleter.prototype.filter = function(queryTerms, onComplete) {
      var description, query, ref, suggestion, suggestions, type, url;
      ref = this.getSearchEngineMatches(queryTerms), url = ref.url, description = ref.description;
      suggestions = [];
      if (url) {
        url = url.replace(/%s/g, Utils.createSearchQuery(queryTerms.slice(1)));
        if (description) {
          type = description;
          query = queryTerms.slice(1).join(" ");
        } else {
          type = "search";
          query = queryTerms[0] + ": " + queryTerms.slice(1).join(" ");
        }
        suggestion = new Suggestion(queryTerms, type, url, query, this.computeRelevancy);
        suggestion.autoSelect = true;
        suggestions.push(suggestion);
      }
      return onComplete(suggestions);
    };

    SearchEngineCompleter.prototype.computeRelevancy = function() {
      return 1;
    };

    SearchEngineCompleter.prototype.refresh = function() {
      return this.searchEngines = SearchEngineCompleter.getSearchEngines();
    };

    SearchEngineCompleter.prototype.getSearchEngineMatches = function(queryTerms) {
      return (1 < queryTerms.length && this.searchEngines[queryTerms[0]]) || {};
    };

    SearchEngineCompleter.searchEnginesMap = null;

    SearchEngineCompleter.parseSearchEngines = function(searchEnginesText) {
      var j, keywords, len, line, ref, results1, searchEnginesMap, tokens;
      searchEnginesMap = SearchEngineCompleter.searchEnginesMap = {};
      ref = searchEnginesText.split(/\n/);
      results1 = [];
      for (j = 0, len = ref.length; j < len; j++) {
        line = ref[j];
        tokens = line.trim().split(/\s+/);
        if (tokens.length < 2 || tokens[0].startsWith('"') || tokens[0].startsWith("#")) {
          continue;
        }
        keywords = tokens[0].split(":");
        if (!(keywords.length === 2 && !keywords[1])) {
          continue;
        }
        results1.push(searchEnginesMap[keywords[0]] = {
          url: tokens[1],
          description: tokens.slice(2).join(" ")
        });
      }
      return results1;
    };

    SearchEngineCompleter.getSearchEngines = function() {
      if (SearchEngineCompleter.searchEnginesMap == null) {
        SearchEngineCompleter.parseSearchEngines(Settings.get("searchEngines"));
      }
      return SearchEngineCompleter.searchEnginesMap;
    };

    return SearchEngineCompleter;

  })();

  MultiCompleter = (function() {
    function MultiCompleter(completers) {
      this.completers = completers;
      this.maxResults = 10;
    }

    MultiCompleter.prototype.refresh = function() {
      var completer, j, len, ref, results1;
      ref = this.completers;
      results1 = [];
      for (j = 0, len = ref.length; j < len; j++) {
        completer = ref[j];
        if (completer.refresh) {
          results1.push(completer.refresh());
        }
      }
      return results1;
    };

    MultiCompleter.prototype.filter = function(queryTerms, onComplete) {
      var completer, completersFinished, j, len, ref, results1, suggestions;
      if (this.filterInProgress) {
        this.mostRecentQuery = {
          queryTerms: queryTerms,
          onComplete: onComplete
        };
        return;
      }
      RegexpCache.clear();
      this.mostRecentQuery = null;
      this.filterInProgress = true;
      suggestions = [];
      completersFinished = 0;
      ref = this.completers;
      results1 = [];
      for (j = 0, len = ref.length; j < len; j++) {
        completer = ref[j];
        results1.push(completer.filter(queryTerms, (function(_this) {
          return function(newSuggestions) {
            var k, len1, result, results;
            suggestions = suggestions.concat(newSuggestions);
            completersFinished += 1;
            if (completersFinished >= _this.completers.length) {
              results = _this.sortSuggestions(suggestions).slice(0, _this.maxResults);
              for (k = 0, len1 = results.length; k < len1; k++) {
                result = results[k];
                result.generateHtml();
              }
              onComplete(results);
              _this.filterInProgress = false;
              if (_this.mostRecentQuery) {
                return _this.filter(_this.mostRecentQuery.queryTerms, _this.mostRecentQuery.onComplete);
              }
            }
          };
        })(this)));
      }
      return results1;
    };

    MultiCompleter.prototype.sortSuggestions = function(suggestions) {
      var j, len, suggestion;
      for (j = 0, len = suggestions.length; j < len; j++) {
        suggestion = suggestions[j];
        suggestion.computeRelevancy(this.queryTerms);
      }
      suggestions.sort(function(a, b) {
        return b.relevancy - a.relevancy;
      });
      return suggestions;
    };

    return MultiCompleter;

  })();

  RankingUtils = {
    matches: function() {
      var j, k, len, len1, matchedTerm, queryTerms, regexp, term, thing, things;
      queryTerms = arguments[0], things = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      for (j = 0, len = queryTerms.length; j < len; j++) {
        term = queryTerms[j];
        regexp = RegexpCache.get(term);
        matchedTerm = false;
        for (k = 0, len1 = things.length; k < len1; k++) {
          thing = things[k];
          matchedTerm || (matchedTerm = thing.match(regexp));
        }
        if (!matchedTerm) {
          return false;
        }
      }
      return true;
    },
    matchWeights: {
      matchAnywhere: 1,
      matchStartOfWord: 1,
      matchWholeWord: 1,
      maximumScore: 3,
      recencyCalibrator: 2.0 / 3.0
    },
    scoreTerm: function(term, string) {
      var count, nonMatching, score;
      score = 0;
      count = 0;
      nonMatching = string.split(RegexpCache.get(term));
      if (nonMatching.length > 1) {
        score = RankingUtils.matchWeights.matchAnywhere;
        count = nonMatching.reduce((function(p, c) {
          return p - c.length;
        }), string.length);
        if (RegexpCache.get(term, "\\b").test(string)) {
          score += RankingUtils.matchWeights.matchStartOfWord;
          if (RegexpCache.get(term, "\\b", "\\b").test(string)) {
            score += RankingUtils.matchWeights.matchWholeWord;
          }
        }
      }
      return [score, count < string.length ? count : string.length];
    },
    wordRelevancy: function(queryTerms, url, title) {
      var c, j, len, maximumPossibleScore, ref, ref1, s, term, titleCount, titleScore, urlCount, urlScore;
      urlScore = titleScore = 0.0;
      urlCount = titleCount = 0;
      for (j = 0, len = queryTerms.length; j < len; j++) {
        term = queryTerms[j];
        ref = RankingUtils.scoreTerm(term, url), s = ref[0], c = ref[1];
        urlScore += s;
        urlCount += c;
        if (title) {
          ref1 = RankingUtils.scoreTerm(term, title), s = ref1[0], c = ref1[1];
          titleScore += s;
          titleCount += c;
        }
      }
      maximumPossibleScore = RankingUtils.matchWeights.maximumScore * queryTerms.length;
      urlScore /= maximumPossibleScore;
      urlScore *= RankingUtils.normalizeDifference(urlCount, url.length);
      if (title) {
        titleScore /= maximumPossibleScore;
        titleScore *= RankingUtils.normalizeDifference(titleCount, title.length);
      } else {
        titleScore = urlScore;
      }
      if (urlScore < titleScore) {
        urlScore = titleScore;
      }
      return (urlScore + titleScore) / 2;
    },
    recencyScore: function(lastAccessedTime) {
      var recency, recencyDifference, recencyScore;
      this.oneMonthAgo || (this.oneMonthAgo = 1000 * 60 * 60 * 24 * 30);
      recency = Date.now() - lastAccessedTime;
      recencyDifference = Math.max(0, this.oneMonthAgo - recency) / this.oneMonthAgo;
      recencyScore = recencyDifference * recencyDifference * recencyDifference;
      return recencyScore *= RankingUtils.matchWeights.recencyCalibrator;
    },
    normalizeDifference: function(a, b) {
      var max;
      max = Math.max(a, b);
      return (max - Math.abs(a - b)) / max;
    }
  };

  RegexpCache = {
    init: function() {
      this.initialized = true;
      this.clear();
      return this.escapeRegExp || (this.escapeRegExp = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g);
    },
    clear: function() {
      return this.cache = {};
    },
    get: function(string, prefix, suffix) {
      var base, regexpString;
      if (prefix == null) {
        prefix = "";
      }
      if (suffix == null) {
        suffix = "";
      }
      if (!this.initialized) {
        this.init();
      }
      regexpString = string.replace(this.escapeRegExp, "\\$&");
      if (prefix) {
        regexpString = prefix + regexpString;
      }
      if (suffix) {
        regexpString = regexpString + suffix;
      }
      return (base = this.cache)[regexpString] || (base[regexpString] = new RegExp(regexpString, (Utils.hasUpperCase(string) ? "" : "i")));
    }
  };

  HistoryCache = {
    size: 20000,
    history: null,
    reset: function() {
      this.history = null;
      return this.callbacks = null;
    },
    use: function(callback) {
      if (this.history == null) {
        return this.fetchHistory(callback);
      }
      return callback(this.history);
    },
    fetchHistory: function(callback) {
      if (this.callbacks) {
        return this.callbacks.push(callback);
      }
      this.callbacks = [callback];
      return chrome.history.search({
        text: "",
        maxResults: this.size,
        startTime: 0
      }, (function(_this) {
        return function(history) {
          var j, len, ref;
          history.sort(_this.compareHistoryByUrl);
          _this.history = history;
          chrome.history.onVisited.addListener(_this.onPageVisited.bind(_this));
          chrome.history.onVisitRemoved.addListener(_this.onVisitRemoved.bind(_this));
          ref = _this.callbacks;
          for (j = 0, len = ref.length; j < len; j++) {
            callback = ref[j];
            callback(_this.history);
          }
          return _this.callbacks = null;
        };
      })(this));
    },
    compareHistoryByUrl: function(a, b) {
      if (a.url === b.url) {
        return 0;
      }
      if (a.url > b.url) {
        return 1;
      }
      return -1;
    },
    onPageVisited: function(newPage) {
      var i, pageWasFound;
      i = HistoryCache.binarySearch(newPage, this.history, this.compareHistoryByUrl);
      pageWasFound = this.history[i].url === newPage.url;
      if (pageWasFound) {
        return this.history[i] = newPage;
      } else {
        return this.history.splice(i, 0, newPage);
      }
    },
    onVisitRemoved: function(toRemove) {
      if (toRemove.allHistory) {
        return this.history = [];
      } else {
        return toRemove.urls.forEach((function(_this) {
          return function(url) {
            var i;
            i = HistoryCache.binarySearch({
              url: url
            }, _this.history, _this.compareHistoryByUrl);
            if (i < _this.history.length && _this.history[i].url === url) {
              return _this.history.splice(i, 1);
            }
          };
        })(this));
      }
    }
  };

  HistoryCache.binarySearch = function(targetElement, array, compareFunction) {
    var compareResult, element, high, low, middle;
    high = array.length - 1;
    low = 0;
    while (low <= high) {
      middle = Math.floor((low + high) / 2);
      element = array[middle];
      compareResult = compareFunction(element, targetElement);
      if (compareResult > 0) {
        high = middle - 1;
      } else if (compareResult < 0) {
        low = middle + 1;
      } else {
        return middle;
      }
    }
    if (compareFunction(element, targetElement) < 0) {
      return middle + 1;
    } else {
      return middle;
    }
  };

  root = typeof exports !== "undefined" && exports !== null ? exports : window;

  root.Suggestion = Suggestion;

  root.BookmarkCompleter = BookmarkCompleter;

  root.MultiCompleter = MultiCompleter;

  root.HistoryCompleter = HistoryCompleter;

  root.DomainCompleter = DomainCompleter;

  root.TabCompleter = TabCompleter;

  root.SearchEngineCompleter = SearchEngineCompleter;

  root.HistoryCache = HistoryCache;

  root.RankingUtils = RankingUtils;

  root.RegexpCache = RegexpCache;

  root.TabRecency = TabRecency;

}).call(this);
