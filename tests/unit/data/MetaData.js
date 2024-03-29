export const testPageNodes = [{
    "type": "target",
    "children": [{
      "type": "target_identifier",
      "children": [{
          "type": "substitution_reference",
          "children": [{
            "type": "text",
            "value": "Atlas Search"
          }],
          "name": "fts"
        },
        {
          "type": "text",
          "value": " Overview"
        }
      ],
      "ids": [
        "what-is-fts"
      ]
    }],
    "domain": "std",
    "name": "label",
    "html_id": "std-label-what-is-fts"
  },
  {
    "type": "section",
    "children": [{
        "type": "heading",
        "children": [{
            "type": "substitution_reference",
            "children": [{
              "type": "text",
              "value": "Atlas Search"
            }],
            "name": "fts"
          },
          {
            "type": "text",
            "value": " Overview"
          }
        ],
        "id": "fts-overview"
      },
      {
        "type": "directive",
        "children": [],
        "domain": "",
        "name": "default-domain",
        "argument": [{
          "type": "text",
          "position": {
            "start": {
              "line": 6
            }
          },
          "value": "mongodb"
        }]
      },
      {
        "type": "directive",
        "children": [],
        "domain": "",
        "name": "meta",
        "argument": [],
        "options": {
          "keywords": "atlas search, atlas search overview, text indexing, query data, advance search capabilities, text analyzer, search aggregation pipeline stage, searchMeta aggregation pipeline stage, atlas search architecture, apache lucene, atlas search indexes, atlas search queries",
          "description": "Learn how MongoDB Atlas can perform advanced text searches in your application using Atlas Search aggregation pipeline stages, MongoDB aggregation pipeline stages, and score-based results ranking."
        }
      },
      {
        "type": "directive",
        "children": [],
        "domain": "",
        "name": "contents",
        "argument": [{
          "type": "text",
          "position": {
            "start": {
              "line": 12
            }
          },
          "value": "On this page"
        }],
        "options": {
          "local": true,
          "backlinks": "none",
          "depth": 2,
          "class": "singlecol"
        }
      },
      {
        "type": "paragraph",
        "children": [{
            "type": "text",
            "value": "MongoDB's "
          },
          {
            "type": "substitution_reference",
            "children": [{
              "type": "text",
              "value": "Atlas Search"
            }],
            "name": "fts"
          },
          {
            "type": "text",
            "value": " allows fine-grained text indexing and querying of data\non your "
          },
          {
            "type": "substitution_reference",
            "children": [{
              "type": "text",
              "value": "Atlas"
            }],
            "name": "service"
          },
          {
            "type": "text",
            "value": " cluster. It enables advanced search functionality for\nyour applications without any additional management or separate search\nsystem alongside your database. "
          },
          {
            "type": "substitution_reference",
            "children": [{
              "type": "text",
              "value": "Atlas Search"
            }],
            "name": "fts"
          },
          {
            "type": "text",
            "value": " provides options for several\nkinds of "
          },
          {
            "type": "ref_role",
            "children": [{
              "type": "text",
              "value": "text analyzers"
            }],
            "domain": "std",
            "name": "label",
            "target": "analyzers-ref",
            "flag": "",
            "fileid": [
              "atlas-search/analyzers",
              "std-label-analyzers-ref"
            ]
          },
          {
            "type": "text",
            "value": ", a rich "
          },
          {
            "type": "ref_role",
            "children": [{
              "type": "text",
              "value": "query\nlanguage"
            }],
            "domain": "std",
            "name": "label",
            "target": "query-syntax-ref",
            "flag": "",
            "fileid": [
              "atlas-search/query-syntax",
              "std-label-query-syntax-ref"
            ]
          },
          {
            "type": "text",
            "value": " that uses "
          },
          {
            "type": "substitution_reference",
            "children": [{
              "type": "text",
              "value": "Atlas Search"
            }],
            "name": "fts"
          },
          {
            "type": "text",
            "value": " aggregation pipeline\nstages like "
          },
          {
            "type": "ref_role",
            "children": [{
              "type": "literal",
              "children": [{
                "type": "text",
                "value": "$search"
              }]
            }],
            "domain": "mongodb",
            "name": "pipeline",
            "target": "pipe.$search",
            "flag": "",
            "fileid": [
              "atlas-search/query-syntax",
              "mongodb-pipeline-pipe.-search"
            ]
          },
          {
            "type": "text",
            "value": " and "
          },
          {
            "type": "ref_role",
            "children": [{
              "type": "literal",
              "children": [{
                "type": "text",
                "value": "$searchMeta"
              }]
            }],
            "domain": "mongodb",
            "name": "pipeline",
            "target": "pipe.$searchMeta",
            "flag": "",
            "fileid": [
              "atlas-search/query-syntax",
              "mongodb-pipeline-pipe.-searchMeta"
            ]
          },
          {
            "type": "text",
            "value": " in\nconjunction with other MongoDB aggregation pipeline stages, and\nscore-based results ranking."
          }
        ]
      },
      {
        "type": "paragraph",
        "children": [{
            "type": "substitution_reference",
            "children": [{
              "type": "text",
              "value": "Atlas Search"
            }],
            "name": "fts"
          },
          {
            "type": "text",
            "value": " is available on "
          },
          {
            "type": "substitution_reference",
            "children": [{
              "type": "text",
              "value": "Atlas"
            }],
            "name": "service"
          },
          {
            "type": "text",
            "value": " instances running MongoDB 4.2 or higher\nversions only. For certain features, "
          },
          {
            "type": "substitution_reference",
            "children": [{
              "type": "text",
              "value": "Atlas Search"
            }],
            "name": "fts"
          },
          {
            "type": "text",
            "value": " might require a specific\nversion of MongoDB. The following table lists the "
          },
          {
            "type": "substitution_reference",
            "children": [{
              "type": "text",
              "value": "Atlas Search"
            }],
            "name": "fts"
          },
          {
            "type": "text",
            "value": " features that\nrequire specific MongoDB versions."
          }
        ]
      },
      {
        "type": "directive",
        "children": [{
          "type": "list",
          "children": [{
              "type": "listItem",
              "children": [{
                "type": "list",
                "children": [{
                    "type": "listItem",
                    "children": [{
                      "type": "paragraph",
                      "children": [{
                          "type": "substitution_reference",
                          "children": [{
                            "type": "text",
                            "value": "Atlas Search"
                          }],
                          "name": "fts"
                        },
                        {
                          "type": "text",
                          "value": " Feature"
                        }
                      ]
                    }]
                  },
                  {
                    "type": "listItem",
                    "children": [{
                      "type": "paragraph",
                      "children": [{
                        "type": "text",
                        "value": "MongoDB Version for Feature"
                      }]
                    }]
                  }
                ],
                "enumtype": "unordered"
              }]
            },
            {
              "type": "listItem",
              "children": [{
                "type": "list",
                "children": [{
                    "type": "listItem",
                    "children": [{
                      "type": "paragraph",
                      "children": [{
                        "type": "ref_role",
                        "children": [{
                          "type": "text",
                          "value": "Facets"
                        }],
                        "domain": "std",
                        "name": "label",
                        "target": "fts-facet-ref",
                        "flag": "",
                        "fileid": [
                          "atlas-search/facet",
                          "std-label-fts-facet-ref"
                        ]
                      }]
                    }]
                  },
                  {
                    "type": "listItem",
                    "children": [{
                      "type": "paragraph",
                      "children": [{
                        "type": "text",
                        "value": "4.4.11+, 5.0.4+, 6.0+"
                      }]
                    }]
                  }
                ],
                "enumtype": "unordered"
              }]
            },
            {
              "type": "listItem",
              "children": [{
                "type": "list",
                "children": [{
                    "type": "listItem",
                    "children": [{
                      "type": "paragraph",
                      "children": [{
                        "type": "ref_role",
                        "children": [{
                          "type": "text",
                          "value": "Facets on Sharded Clusters"
                        }],
                        "domain": "std",
                        "name": "label",
                        "target": "fts-facet-ref",
                        "flag": "",
                        "fileid": [
                          "atlas-search/facet",
                          "std-label-fts-facet-ref"
                        ]
                      }]
                    }]
                  },
                  {
                    "type": "listItem",
                    "children": [{
                      "type": "paragraph",
                      "children": [{
                        "type": "text",
                        "value": "6.0+"
                      }]
                    }]
                  }
                ],
                "enumtype": "unordered"
              }]
            },
            {
              "type": "listItem",
              "children": [{
                "type": "list",
                "children": [{
                    "type": "listItem",
                    "children": [{
                      "type": "paragraph",
                      "children": [{
                        "type": "ref_role",
                        "children": [{
                          "type": "text",
                          "value": "Stored Source Fields"
                        }],
                        "domain": "std",
                        "name": "label",
                        "target": "fts-stored-source-definition",
                        "flag": "",
                        "fileid": [
                          "atlas-search/stored-source-definition",
                          "std-label-fts-stored-source-definition"
                        ]
                      }]
                    }]
                  },
                  {
                    "type": "listItem",
                    "children": [{
                      "type": "paragraph",
                      "children": [{
                        "type": "text",
                        "value": "4.4.12+, 5.0.6+, 6.0+"
                      }]
                    }]
                  }
                ],
                "enumtype": "unordered"
              }]
            },
            {
              "type": "listItem",
              "children": [{
                "type": "list",
                "children": [{
                    "type": "listItem",
                    "children": [{
                      "type": "paragraph",
                      "children": [{
                        "type": "ref_role",
                        "children": [{
                          "type": "text",
                          "value": "$lookup with $search"
                        }],
                        "domain": "std",
                        "name": "label",
                        "target": "lookup-with-search-tutorial",
                        "flag": "",
                        "fileid": [
                          "atlas-search/tutorial/lookup-with-search",
                          "std-label-lookup-with-search-tutorial"
                        ]
                      }]
                    }]
                  },
                  {
                    "type": "listItem",
                    "children": [{
                      "type": "paragraph",
                      "children": [{
                        "type": "text",
                        "value": "6.0+"
                      }]
                    }]
                  }
                ],
                "enumtype": "unordered"
              }]
            },
            {
              "type": "listItem",
              "children": [{
                "type": "list",
                "children": [{
                    "type": "listItem",
                    "children": [{
                      "type": "paragraph",
                      "children": [{
                        "type": "ref_role",
                        "children": [{
                          "type": "text",
                          "value": "$unionWith with $search"
                        }],
                        "domain": "std",
                        "name": "label",
                        "target": "search-with-unionwith-tutorial",
                        "flag": "",
                        "fileid": [
                          "atlas-search/tutorial/search-with-unionwith",
                          "std-label-search-with-unionwith-tutorial"
                        ]
                      }]
                    }]
                  },
                  {
                    "type": "listItem",
                    "children": [{
                      "type": "paragraph",
                      "children": [{
                        "type": "text",
                        "value": "6.0+"
                      }]
                    }]
                  }
                ],
                "enumtype": "unordered"
              }]
            }
          ],
          "enumtype": "unordered"
        }],
        "domain": "",
        "name": "list-table",
        "argument": [],
        "options": {
          "header-rows": 1,
          "widths": "50 50"
        }
      },
      {
        "type": "paragraph",
        "children": [{
            "type": "substitution_reference",
            "children": [{
              "type": "text",
              "value": "Atlas Search"
            }],
            "name": "fts"
          },
          {
            "type": "text",
            "value": " is not supported for "
          },
          {
            "type": "reference",
            "children": [{
              "type": "text",
              "value": "time series"
            }],
            "refuri": "https://www.mongodb.com/docs/manual/core/timeseries-collections/"
          },
          {
            "type": "text",
            "value": " collections."
          }
        ]
      },
      {
        "type": "target",
        "children": [{
          "type": "target_identifier",
          "children": [{
              "type": "substitution_reference",
              "children": [{
                "type": "text",
                "value": "Atlas Search"
              }],
              "name": "fts"
            },
            {
              "type": "text",
              "value": " Architecture"
            }
          ],
          "ids": [
            "fts-architecture"
          ]
        }],
        "domain": "std",
        "name": "label",
        "html_id": "std-label-fts-architecture"
      },
      {
        "type": "section",
        "children": [{
            "type": "heading",
            "children": [{
                "type": "substitution_reference",
                "children": [{
                  "type": "text",
                  "value": "Atlas Search"
                }],
                "name": "fts"
              },
              {
                "type": "text",
                "value": " Architecture"
              }
            ],
            "id": "fts-architecture"
          },
          {
            "type": "paragraph",
            "children": [{
                "type": "text",
                "value": "The "
              },
              {
                "type": "substitution_reference",
                "children": [{
                  "type": "text",
                  "value": "Atlas Search"
                }],
                "name": "fts"
              },
              {
                "type": "text",
                "value": " "
              },
              {
                "type": "literal",
                "children": [{
                  "type": "text",
                  "value": "mongot"
                }]
              },
              {
                "type": "text",
                "value": " Java web process uses "
              },
              {
                "type": "reference",
                "children": [{
                  "type": "text",
                  "value": "Apache Lucene"
                }],
                "refuri": "https://lucene.apache.org/"
              },
              {
                "type": "text",
                "value": " and runs alongside "
              },
              {
                "type": "literal",
                "children": [{
                  "type": "text",
                  "value": "mongod"
                }]
              },
              {
                "type": "text",
                "value": " on each\nnode in the "
              },
              {
                "type": "substitution_reference",
                "children": [{
                  "type": "text",
                  "value": "Atlas"
                }],
                "name": "service"
              },
              {
                "type": "text",
                "value": " cluster. The "
              },
              {
                "type": "literal",
                "children": [{
                  "type": "text",
                  "value": "mongot"
                }]
              },
              {
                "type": "text",
                "value": " process:"
              }
            ]
          },
          {
            "type": "list",
            "children": [{
                "type": "listItem",
                "children": [{
                  "type": "paragraph",
                  "children": [{
                      "type": "text",
                      "value": "Creates "
                    },
                    {
                      "type": "substitution_reference",
                      "children": [{
                        "type": "text",
                        "value": "Atlas Search"
                      }],
                      "name": "fts"
                    },
                    {
                      "type": "text",
                      "value": " indexes based on the rules in the "
                    },
                    {
                      "type": "ref_role",
                      "children": [{
                        "type": "text",
                        "value": "index\ndefinition"
                      }],
                      "domain": "std",
                      "name": "label",
                      "target": "ref-index-definitions",
                      "flag": "",
                      "fileid": [
                        "atlas-search/index-definitions",
                        "std-label-ref-index-definitions"
                      ]
                    },
                    {
                      "type": "text",
                      "value": " for the collection."
                    }
                  ]
                }]
              },
              {
                "type": "listItem",
                "children": [{
                  "type": "paragraph",
                  "children": [{
                      "type": "text",
                      "value": "Monitors "
                    },
                    {
                      "type": "reference",
                      "children": [{
                        "type": "text",
                        "value": "change streams"
                      }],
                      "refuri": "https://www.mongodb.com/docs/manual/changeStreams/"
                    },
                    {
                      "type": "text",
                      "value": " for the current\nstate of the documents and index changes for the collections for\nwhich you defined "
                    },
                    {
                      "type": "substitution_reference",
                      "children": [{
                        "type": "text",
                        "value": "Atlas Search"
                      }],
                      "name": "fts"
                    },
                    {
                      "type": "text",
                      "value": " indexes."
                    }
                  ]
                }]
              },
              {
                "type": "listItem",
                "children": [{
                  "type": "paragraph",
                  "children": [{
                      "type": "text",
                      "value": "Processes "
                    },
                    {
                      "type": "substitution_reference",
                      "children": [{
                        "type": "text",
                        "value": "Atlas Search"
                      }],
                      "name": "fts"
                    },
                    {
                      "type": "text",
                      "value": " queries and returns matching documents."
                    }
                  ]
                }]
              }
            ],
            "enumtype": "arabic"
          },
          {
            "type": "directive",
            "children": [],
            "domain": "",
            "name": "image",
            "argument": [{
              "type": "text",
              "position": {
                "start": {
                  "line": 74
                }
              },
              "value": "/images/fts-architecture.png"
            }],
            "options": {
              "alt": "Atlas Search architecture",
              "figwidth": "100%",
              "checksum": "92deb61b72e97cb39696ede300610d1f370bad5bb47f7f954e3c7f71e53da399"
            }
          },
          {
            "type": "paragraph",
            "children": [{
                "type": "text",
                "value": "If you define "
              },
              {
                "type": "ref_role",
                "children": [{
                  "type": "text",
                  "value": "stored source"
                }],
                "domain": "std",
                "name": "label",
                "target": "fts-stored-source-definition",
                "flag": "",
                "fileid": [
                  "atlas-search/stored-source-definition",
                  "std-label-fts-stored-source-definition"
                ]
              },
              {
                "type": "text",
                "value": "\nfields in your "
              },
              {
                "type": "substitution_reference",
                "children": [{
                  "type": "text",
                  "value": "Atlas Search"
                }],
                "name": "fts"
              },
              {
                "type": "text",
                "value": " index, the "
              },
              {
                "type": "literal",
                "children": [{
                  "type": "text",
                  "value": "mongot"
                }]
              },
              {
                "type": "text",
                "value": " process stores the\nspecified fields and, for matching documents, returns the stored fields\ndirectly from "
              },
              {
                "type": "literal",
                "children": [{
                  "type": "text",
                  "value": "mongot"
                }]
              },
              {
                "type": "text",
                "value": " instead of doing a full document lookup on the\ndatabase if you specify the "
              },
              {
                "type": "ref_role",
                "children": [{
                  "type": "text",
                  "value": "returnStoredSource Option"
                }],
                "domain": "std",
                "name": "label",
                "target": "fts-return-stored-source-option",
                "flag": "",
                "fileid": [
                  "atlas-search/return-stored-source",
                  "std-label-fts-return-stored-source-option"
                ]
              },
              {
                "type": "text",
                "value": " in your query."
              }
            ]
          },
          {
            "type": "directive",
            "children": [],
            "domain": "",
            "name": "image",
            "argument": [{
              "type": "text",
              "position": {
                "start": {
                  "line": 85
                }
              },
              "value": "/images/fts-stored-source-architecture.png"
            }],
            "options": {
              "alt": "Atlas Search stored source architecture",
              "figwidth": "100%",
              "checksum": "db21aa8b126b93ad04fe5ac18ee7bde26a34ed090780976700baee2b8a029cc8"
            }
          },
          {
            "type": "section",
            "children": [{
                "type": "heading",
                "children": [{
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": " Indexes"
                  }
                ],
                "id": "fts-indexes"
              },
              {
                "type": "directive",
                "children": [{
                  "type": "root",
                  "children": [{
                      "type": "paragraph",
                      "children": [{
                          "type": "substitution_reference",
                          "children": [{
                            "type": "text",
                            "value": "Atlas Search"
                          }],
                          "name": "fts"
                        },
                        {
                          "type": "text",
                          "value": " index is a data structure that categorizes data in an easily\nsearchable format. It is a mapping between terms and the documents that\ncontain those terms. "
                        },
                        {
                          "type": "substitution_reference",
                          "children": [{
                            "type": "text",
                            "value": "Atlas Search"
                          }],
                          "name": "fts"
                        },
                        {
                          "type": "text",
                          "value": " indexes enable faster retrieval of documents\nusing certain identifiers. You must configure an "
                        },
                        {
                          "type": "substitution_reference",
                          "children": [{
                            "type": "text",
                            "value": "Atlas Search"
                          }],
                          "name": "fts"
                        },
                        {
                          "type": "text",
                          "value": " index to query\ndata in your "
                        },
                        {
                          "type": "substitution_reference",
                          "children": [{
                            "type": "text",
                            "value": "Atlas"
                          }],
                          "name": "service"
                        },
                        {
                          "type": "text",
                          "value": " cluster using "
                        },
                        {
                          "type": "substitution_reference",
                          "children": [{
                            "type": "text",
                            "value": "Atlas Search"
                          }],
                          "name": "fts"
                        },
                        {
                          "type": "text",
                          "value": "."
                        }
                      ]
                    },
                    {
                      "type": "paragraph",
                      "children": [{
                          "type": "text",
                          "value": "You can create an "
                        },
                        {
                          "type": "substitution_reference",
                          "children": [{
                            "type": "text",
                            "value": "Atlas Search"
                          }],
                          "name": "fts"
                        },
                        {
                          "type": "text",
                          "value": " index on a single field or on multiple fields.\nWe recommend that you index the fields that you regularly use to sort\nor filter your data in order to quickly retrieve the documents that\ncontain the relevant data at query-time."
                        }
                      ]
                    }
                  ],
                  "fileid": "includes/facts/fts-index-description.rst"
                }],
                "domain": "",
                "name": "include",
                "argument": [{
                  "type": "text",
                  "position": {
                    "start": {
                      "line": 92
                    }
                  },
                  "value": "/includes/facts/fts-index-description.rst"
                }]
              },
              {
                "type": "paragraph",
                "children": [{
                    "type": "text",
                    "value": "When you configure one or more "
                  },
                  {
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": " indexes, "
                  },
                  {
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas"
                    }],
                    "name": "service"
                  },
                  {
                    "type": "text",
                    "value": " enables the\n"
                  },
                  {
                    "type": "literal",
                    "children": [{
                      "type": "text",
                      "value": "mongot"
                    }]
                  },
                  {
                    "type": "text",
                    "value": " process on the nodes in the cluster. Each "
                  },
                  {
                    "type": "literal",
                    "children": [{
                      "type": "text",
                      "value": "mongot"
                    }]
                  },
                  {
                    "type": "text",
                    "value": " process\ntalks to the "
                  },
                  {
                    "type": "literal",
                    "children": [{
                      "type": "text",
                      "value": "mongod"
                    }]
                  },
                  {
                    "type": "text",
                    "value": " on the same node. To create and update search\nindexes, the "
                  },
                  {
                    "type": "literal",
                    "children": [{
                      "type": "text",
                      "value": "mongot"
                    }]
                  },
                  {
                    "type": "text",
                    "value": " process performs collection scans on the\nbackend database and opens change streams for each index."
                  }
                ]
              },
              {
                "type": "paragraph",
                "children": [{
                  "type": "text",
                  "value": "You can specify the fields to index using the following methods:"
                }]
              },
              {
                "type": "list",
                "children": [{
                    "type": "listItem",
                    "children": [{
                      "type": "paragraph",
                      "children": [{
                          "type": "ref_role",
                          "children": [{
                            "type": "text",
                            "value": "Dynamic mappings"
                          }],
                          "domain": "std",
                          "name": "label",
                          "target": "static-dynamic-mappings",
                          "flag": "",
                          "fileid": [
                            "atlas-search/define-field-mappings",
                            "std-label-static-dynamic-mappings"
                          ]
                        },
                        {
                          "type": "text",
                          "value": ", which enables\n"
                        },
                        {
                          "type": "substitution_reference",
                          "children": [{
                            "type": "text",
                            "value": "Atlas Search"
                          }],
                          "name": "fts"
                        },
                        {
                          "type": "text",
                          "value": " to automatically index all the fields of "
                        },
                        {
                          "type": "ref_role",
                          "children": [{
                            "type": "text",
                            "value": "supported types"
                          }],
                          "domain": "std",
                          "name": "label",
                          "target": "bson-data-chart",
                          "flag": "",
                          "fileid": [
                            "atlas-search/define-field-mappings",
                            "std-label-bson-data-chart"
                          ]
                        },
                        {
                          "type": "text",
                          "value": " in each document. This takes disk space and might\nnegatively impact cluster performance."
                        }
                      ]
                    }]
                  },
                  {
                    "type": "listItem",
                    "children": [{
                      "type": "paragraph",
                      "children": [{
                          "type": "ref_role",
                          "children": [{
                            "type": "text",
                            "value": "Static mappings"
                          }],
                          "domain": "std",
                          "name": "label",
                          "target": "static-dynamic-mappings",
                          "flag": "",
                          "fileid": [
                            "atlas-search/define-field-mappings",
                            "std-label-static-dynamic-mappings"
                          ]
                        },
                        {
                          "type": "text",
                          "value": ", which allows you to\nselectively identify the fields to index."
                        }
                      ]
                    }]
                  }
                ],
                "enumtype": "unordered"
              },
              {
                "type": "paragraph",
                "children": [{
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": " performs inverted indexing and stores the indexed fields on disk.\nAn inverted index is a mapping between terms and which documents contain\nthose terms. "
                  },
                  {
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": " indexes contain the term, the "
                  },
                  {
                    "type": "literal",
                    "children": [{
                      "type": "text",
                      "value": "_id"
                    }]
                  },
                  {
                    "type": "text",
                    "value": ", and other\nrelevant metadata about the term, such as the position of the term, in\nthe document."
                  }
                ]
              },
              {
                "type": "paragraph",
                "children": [{
                    "type": "text",
                    "value": "Although the data stored on "
                  },
                  {
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": " isn't an identical copy of data from\nthe collection on your "
                  },
                  {
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas"
                    }],
                    "name": "service"
                  },
                  {
                    "type": "text",
                    "value": " cluster, "
                  },
                  {
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": " indexes still take some\ndisk space and memory. If you enable the "
                  },
                  {
                    "type": "literal",
                    "children": [{
                      "type": "text",
                      "value": "store"
                    }]
                  },
                  {
                    "type": "text",
                    "value": " option for fields\nthat contain "
                  },
                  {
                    "type": "ref_role",
                    "children": [{
                      "type": "text",
                      "value": "string"
                    }],
                    "domain": "std",
                    "name": "label",
                    "target": "bson-data-types-string",
                    "flag": "",
                    "fileid": [
                      "atlas-search/field-types/string-type",
                      "std-label-bson-data-types-string"
                    ]
                  },
                  {
                    "type": "text",
                    "value": " values or if you configure\nthe "
                  },
                  {
                    "type": "ref_role",
                    "children": [{
                      "type": "text",
                      "value": "stored source fields"
                    }],
                    "domain": "std",
                    "name": "label",
                    "target": "fts-stored-source-definition",
                    "flag": "",
                    "fileid": [
                      "atlas-search/stored-source-definition",
                      "std-label-fts-stored-source-definition"
                    ]
                  },
                  {
                    "type": "text",
                    "value": " in your\nindex, "
                  },
                  {
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": " stores an identical copy of the specified fields on disk,\nwhich can take disk space."
                  }
                ]
              },
              {
                "type": "paragraph",
                "children": [{
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": " provides built-in analyzers for creating indexable terms that\ncorrect for differences in punctuation, capitalization, stop words,\nand more. Analyzers apply parsing and language rules to the query. You\ncan also create a custom analyzer using available built-in character\nfilters, tokenizers, and token filters. To learn more about the\nbuilt-in and custom analyzers, see "
                  },
                  {
                    "type": "ref_role",
                    "children": [{
                      "type": "text",
                      "value": "Process Data with Analyzers"
                    }],
                    "domain": "std",
                    "name": "label",
                    "target": "analyzers-ref",
                    "flag": "",
                    "fileid": [
                      "atlas-search/analyzers",
                      "std-label-analyzers-ref"
                    ]
                  },
                  {
                    "type": "text",
                    "value": "."
                  }
                ]
              },
              {
                "type": "paragraph",
                "children": [{
                    "type": "text",
                    "value": "For text fields, the "
                  },
                  {
                    "type": "literal",
                    "children": [{
                      "type": "text",
                      "value": "mongot"
                    }]
                  },
                  {
                    "type": "text",
                    "value": " performs the following tasks to create\nindexable tokens:"
                  }
                ]
              },
              {
                "type": "list",
                "children": [{
                    "type": "listItem",
                    "children": [{
                      "type": "paragraph",
                      "children": [{
                        "type": "text",
                        "value": "Analysis of the text"
                      }]
                    }]
                  },
                  {
                    "type": "listItem",
                    "children": [{
                      "type": "paragraph",
                      "children": [{
                        "type": "text",
                        "value": "Tokenization, which is breaking up of words in a string to indexable\ntokens"
                      }]
                    }]
                  },
                  {
                    "type": "listItem",
                    "children": [{
                      "type": "paragraph",
                      "children": [{
                        "type": "text",
                        "value": "Normalization, such as transforming the text to lower case, folding\ndiacritics, and removing stop words"
                      }]
                    }]
                  },
                  {
                    "type": "listItem",
                    "children": [{
                      "type": "paragraph",
                      "children": [{
                        "type": "text",
                        "value": "Stemming, such as ignoring plural and other word forms to index the\nword in the most reduced form"
                      }]
                    }]
                  }
                ],
                "enumtype": "arabic"
              },
              {
                "type": "paragraph",
                "children": [{
                    "type": "text",
                    "value": "To learn more about "
                  },
                  {
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": " support for other data types, see\n"
                  },
                  {
                    "type": "ref_role",
                    "children": [{
                      "type": "text",
                      "value": "Data Types"
                    }],
                    "domain": "std",
                    "name": "label",
                    "target": "bson-data-chart",
                    "flag": "",
                    "fileid": [
                      "atlas-search/define-field-mappings",
                      "std-label-bson-data-chart"
                    ]
                  },
                  {
                    "type": "text",
                    "value": " and "
                  },
                  {
                    "type": "ref_role",
                    "children": [{
                      "type": "text",
                      "value": "Data Types"
                    }],
                    "domain": "std",
                    "name": "label",
                    "target": "bson-data-types",
                    "flag": "",
                    "fileid": [
                      "atlas-search/define-field-mappings",
                      "std-label-bson-data-types"
                    ]
                  },
                  {
                    "type": "text",
                    "value": ". The "
                  },
                  {
                    "type": "literal",
                    "children": [{
                      "type": "text",
                      "value": "mongot"
                    }]
                  },
                  {
                    "type": "text",
                    "value": "\nprocess stores the indexed fields and the "
                  },
                  {
                    "type": "literal",
                    "children": [{
                      "type": "text",
                      "value": "_id"
                    }]
                  },
                  {
                    "type": "text",
                    "value": " field on disk per\nindex for the collections on the cluster."
                  }
                ]
              },
              {
                "type": "paragraph",
                "children": [{
                    "type": "text",
                    "value": "If you change an existing index, "
                  },
                  {
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": " rebuilds the index without downtime.\nThis allows you to continue using the old index for existing and new\nqueries until the index rebuilding is complete."
                  }
                ]
              },
              {
                "type": "paragraph",
                "children": [{
                    "type": "text",
                    "value": "If you make changes to the collection for which you defined "
                  },
                  {
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": "\nindexes, the latest data might not be available immediately for\nqueries. However, "
                  },
                  {
                    "type": "literal",
                    "children": [{
                      "type": "text",
                      "value": "mongot"
                    }]
                  },
                  {
                    "type": "text",
                    "value": " monitors the change streams, which allows\nit to update stored copies of data, and "
                  },
                  {
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": " indexes are eventually\nconsistent."
                  }
                ]
              },
              {
                "type": "paragraph",
                "children": [{
                    "type": "text",
                    "value": "After you set up an "
                  },
                  {
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": " index for a collection, you can run queries\nagainst the indexed fields."
                  }
                ]
              }
            ]
          },
          {
            "type": "section",
            "children": [{
                "type": "heading",
                "children": [{
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": " Queries"
                  }
                ],
                "id": "fts-queries"
              },
              {
                "type": "paragraph",
                "children": [{
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": " queries take the form of an "
                  },
                  {
                    "type": "reference",
                    "children": [{
                      "type": "text",
                      "value": "aggregation pipeline stage"
                    }],
                    "refuri": "https://www.mongodb.com/docs/manual/aggregation/"
                  },
                  {
                    "type": "text",
                    "value": ". "
                  },
                  {
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": " provides "
                  },
                  {
                    "type": "ref_role",
                    "children": [{
                      "type": "literal",
                      "children": [{
                        "type": "text",
                        "value": "$search"
                      }]
                    }],
                    "domain": "mongodb",
                    "name": "pipeline",
                    "target": "pipe.$search",
                    "flag": "",
                    "fileid": [
                      "atlas-search/query-syntax",
                      "mongodb-pipeline-pipe.-search"
                    ]
                  },
                  {
                    "type": "text",
                    "value": " and\n"
                  },
                  {
                    "type": "ref_role",
                    "children": [{
                      "type": "literal",
                      "children": [{
                        "type": "text",
                        "value": "$searchMeta"
                      }]
                    }],
                    "domain": "mongodb",
                    "name": "pipeline",
                    "target": "pipe.$searchMeta",
                    "flag": "",
                    "fileid": [
                      "atlas-search/query-syntax",
                      "mongodb-pipeline-pipe.-searchMeta"
                    ]
                  },
                  {
                    "type": "text",
                    "value": " stages, both of which must be the first stage\nin the query pipeline. These stages can be used in conjunction with\nother "
                  },
                  {
                    "type": "reference",
                    "children": [{
                      "type": "text",
                      "value": "aggregation pipeline stages"
                    }],
                    "refuri": "https://www.mongodb.com/docs/manual/aggregation/"
                  },
                  {
                    "type": "text",
                    "value": " in your\nquery pipeline. To learn more about these pipeline stages, see\n"
                  },
                  {
                    "type": "ref_role",
                    "children": [{
                        "type": "text",
                        "value": "Return "
                      },
                      {
                        "type": "substitution_reference",
                        "children": [{
                          "type": "text",
                          "value": "Atlas Search"
                        }],
                        "name": "fts"
                      },
                      {
                        "type": "text",
                        "value": " Results or Metadata"
                      }
                    ],
                    "domain": "std",
                    "name": "label",
                    "target": "query-syntax-ref",
                    "flag": "",
                    "fileid": [
                      "atlas-search/query-syntax",
                      "std-label-query-syntax-ref"
                    ]
                  },
                  {
                    "type": "text",
                    "value": "."
                  }
                ]
              },
              {
                "type": "paragraph",
                "children": [{
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": " also provides query "
                  },
                  {
                    "type": "ref_role",
                    "children": [{
                      "type": "text",
                      "value": "operators"
                    }],
                    "domain": "std",
                    "name": "label",
                    "target": "operators-ref",
                    "flag": "",
                    "fileid": [
                      "atlas-search/operators-and-collectors",
                      "std-label-operators-ref"
                    ]
                  },
                  {
                    "type": "text",
                    "value": " and\n"
                  },
                  {
                    "type": "ref_role",
                    "children": [{
                      "type": "text",
                      "value": "collectors"
                    }],
                    "domain": "std",
                    "name": "label",
                    "target": "collectors-ref",
                    "flag": "",
                    "fileid": [
                      "atlas-search/operators-and-collectors",
                      "std-label-collectors-ref"
                    ]
                  },
                  {
                    "type": "text",
                    "value": " that you can use inside the\n"
                  },
                  {
                    "type": "ref_role",
                    "children": [{
                      "type": "text",
                      "value": "aggregation pipeline stage"
                    }],
                    "domain": "std",
                    "name": "label",
                    "target": "query-syntax-ref",
                    "flag": "",
                    "fileid": [
                      "atlas-search/query-syntax",
                      "std-label-query-syntax-ref"
                    ]
                  },
                  {
                    "type": "text",
                    "value": ". The "
                  },
                  {
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": "\noperators allow you to locate and retrieve matching data from the\ncollection on your "
                  },
                  {
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas"
                    }],
                    "name": "service"
                  },
                  {
                    "type": "text",
                    "value": " cluster. The collector returns a document\nrepresenting the search metadata results."
                  }
                ]
              },
              {
                "type": "paragraph",
                "children": [{
                    "type": "text",
                    "value": "You can use "
                  },
                  {
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": " operators to query terms, phrases, geographic shapes\nand points, numeric values, similar documents, synonymous terms, and more.\nYou can also search using regex and wildcard expressions. The "
                  },
                  {
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": "\n"
                  },
                  {
                    "type": "ref_role",
                    "children": [{
                      "type": "text",
                      "value": "compound"
                    }],
                    "domain": "std",
                    "name": "label",
                    "target": "compound-ref",
                    "flag": "",
                    "fileid": [
                      "atlas-search/compound",
                      "std-label-compound-ref"
                    ]
                  },
                  {
                    "type": "text",
                    "value": " operator allows you to combine multiple operators\ninside your "
                  },
                  {
                    "type": "ref_role",
                    "children": [{
                      "type": "literal",
                      "children": [{
                        "type": "text",
                        "value": "$search"
                      }]
                    }],
                    "domain": "mongodb",
                    "name": "pipeline",
                    "target": "pipe.$search",
                    "flag": "",
                    "fileid": [
                      "atlas-search/query-syntax",
                      "mongodb-pipeline-pipe.-search"
                    ]
                  },
                  {
                    "type": "text",
                    "value": " stage to perform a complex search and\nfilter of data based on what "
                  },
                  {
                    "type": "emphasis",
                    "children": [{
                      "type": "text",
                      "value": "must"
                    }]
                  },
                  {
                    "type": "text",
                    "value": ", "
                  },
                  {
                    "type": "emphasis",
                    "children": [{
                      "type": "text",
                      "value": "must not"
                    }]
                  },
                  {
                    "type": "text",
                    "value": ", or "
                  },
                  {
                    "type": "emphasis",
                    "children": [{
                      "type": "text",
                      "value": "should"
                    }]
                  },
                  {
                    "type": "text",
                    "value": " be present\nin the documents returned by "
                  },
                  {
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": ". You can use the "
                  },
                  {
                    "type": "ref_role",
                    "children": [{
                      "type": "text",
                      "value": "compound"
                    }],
                    "domain": "std",
                    "name": "label",
                    "target": "compound-ref",
                    "flag": "",
                    "fileid": [
                      "atlas-search/compound",
                      "std-label-compound-ref"
                    ]
                  },
                  {
                    "type": "text",
                    "value": "\noperator to also match or filter documents in the "
                  },
                  {
                    "type": "ref_role",
                    "children": [{
                      "type": "literal",
                      "children": [{
                        "type": "text",
                        "value": "$search"
                      }]
                    }],
                    "domain": "mongodb",
                    "name": "pipeline",
                    "target": "pipe.$search",
                    "flag": "",
                    "fileid": [
                      "atlas-search/query-syntax",
                      "mongodb-pipeline-pipe.-search"
                    ]
                  },
                  {
                    "type": "text",
                    "value": "\nstage itself. Running "
                  },
                  {
                    "type": "ref_role",
                    "children": [{
                      "type": "literal",
                      "children": [{
                        "type": "text",
                        "value": "$match"
                      }]
                    }],
                    "domain": "mongodb",
                    "name": "pipeline",
                    "target": "pipe.$match",
                    "flag": "",
                    "url": "https://www.mongodb.com/docs/master/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match"
                  },
                  {
                    "type": "text",
                    "value": " after "
                  },
                  {
                    "type": "ref_role",
                    "children": [{
                      "type": "literal",
                      "children": [{
                        "type": "text",
                        "value": "$search"
                      }]
                    }],
                    "domain": "mongodb",
                    "name": "pipeline",
                    "target": "pipe.$search",
                    "flag": "",
                    "fileid": [
                      "atlas-search/query-syntax",
                      "mongodb-pipeline-pipe.-search"
                    ]
                  },
                  {
                    "type": "text",
                    "value": " is\nless performant than running "
                  },
                  {
                    "type": "ref_role",
                    "children": [{
                      "type": "literal",
                      "children": [{
                        "type": "text",
                        "value": "$search"
                      }]
                    }],
                    "domain": "mongodb",
                    "name": "pipeline",
                    "target": "pipe.$search",
                    "flag": "",
                    "fileid": [
                      "atlas-search/query-syntax",
                      "mongodb-pipeline-pipe.-search"
                    ]
                  },
                  {
                    "type": "text",
                    "value": " with the\n"
                  },
                  {
                    "type": "ref_role",
                    "children": [{
                      "type": "text",
                      "value": "compound"
                    }],
                    "domain": "std",
                    "name": "label",
                    "target": "compound-ref",
                    "flag": "",
                    "fileid": [
                      "atlas-search/compound",
                      "std-label-compound-ref"
                    ]
                  },
                  {
                    "type": "text",
                    "value": " operator."
                  }
                ]
              },
              {
                "type": "paragraph",
                "children": [{
                    "type": "text",
                    "value": "To learn more about the syntax, options, and usage of the "
                  },
                  {
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": " operators,\nsee "
                  },
                  {
                    "type": "ref_role",
                    "children": [{
                        "type": "text",
                        "value": "Use Operators and Collectors in "
                      },
                      {
                        "type": "substitution_reference",
                        "children": [{
                          "type": "text",
                          "value": "Atlas Search"
                        }],
                        "name": "fts"
                      },
                      {
                        "type": "text",
                        "value": " Queries"
                      }
                    ],
                    "domain": "std",
                    "name": "label",
                    "target": "operators-ref",
                    "flag": "",
                    "fileid": [
                      "atlas-search/operators-and-collectors",
                      "std-label-operators-ref"
                    ]
                  },
                  {
                    "type": "text",
                    "value": "."
                  }
                ]
              },
              {
                "type": "paragraph",
                "children": [{
                    "type": "text",
                    "value": "When you run a query, "
                  },
                  {
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": " uses the "
                  },
                  {
                    "type": "ref_role",
                    "children": [{
                      "type": "text",
                      "value": "configured read preference"
                    }],
                    "domain": "std",
                    "name": "label",
                    "target": "replica-set-tags",
                    "flag": "",
                    "fileid": [
                      "reference/replica-set-tags",
                      "std-label-replica-set-tags"
                    ]
                  },
                  {
                    "type": "text",
                    "value": " to identify the node on which to run the query.\nThe query first goes to the MongoDB process, which is "
                  },
                  {
                    "type": "literal",
                    "children": [{
                      "type": "text",
                      "value": "mongod"
                    }]
                  },
                  {
                    "type": "text",
                    "value": " for a\nreplica set cluster or "
                  },
                  {
                    "type": "literal",
                    "children": [{
                      "type": "text",
                      "value": "mongos"
                    }]
                  },
                  {
                    "type": "text",
                    "value": " for a sharded cluster. For sharded\nclusters, your cluster data is partitioned across "
                  },
                  {
                    "type": "literal",
                    "children": [{
                      "type": "text",
                      "value": "mongod"
                    }]
                  },
                  {
                    "type": "text",
                    "value": " instances\nand each "
                  },
                  {
                    "type": "literal",
                    "children": [{
                      "type": "text",
                      "value": "mongot"
                    }]
                  },
                  {
                    "type": "text",
                    "value": " knows about the data on the "
                  },
                  {
                    "type": "literal",
                    "children": [{
                      "type": "text",
                      "value": "mongod"
                    }]
                  },
                  {
                    "type": "text",
                    "value": " on the same\nnode only. Therefore, you can't run queries that target a particular\nshard. "
                  },
                  {
                    "type": "literal",
                    "children": [{
                      "type": "text",
                      "value": "mongos"
                    }]
                  },
                  {
                    "type": "text",
                    "value": " directs the queries to all shards, making these\n"
                  },
                  {
                    "type": "emphasis",
                    "children": [{
                      "type": "text",
                      "value": "scatter gather"
                    }]
                  },
                  {
                    "type": "text",
                    "value": " queries."
                  }
                ]
              },
              {
                "type": "paragraph",
                "children": [{
                    "type": "text",
                    "value": "The MongoDB process routes the query to the "
                  },
                  {
                    "type": "literal",
                    "children": [{
                      "type": "text",
                      "value": "mongot"
                    }]
                  },
                  {
                    "type": "text",
                    "value": " on the same\nnode. "
                  },
                  {
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": " performs the search and scoring and returns the document\nIDs and other search metadata for the matching results to "
                  },
                  {
                    "type": "literal",
                    "children": [{
                      "type": "text",
                      "value": "mongod"
                    }]
                  },
                  {
                    "type": "text",
                    "value": ".\nThe "
                  },
                  {
                    "type": "literal",
                    "children": [{
                      "type": "text",
                      "value": "mongod"
                    }]
                  },
                  {
                    "type": "text",
                    "value": " then performs a full document lookup implicitly for the\nmatching results and returns the results to the client."
                  }
                ]
              },
              {
                "type": "paragraph",
                "children": [{
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": " associates a relevance-based score with every document in the\nresult set. The relevance-based scoring allows "
                  },
                  {
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": " to return documents\nin the order from the highest score to the lowest. "
                  },
                  {
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": " scores documents\nhigher if the query term appears frequently in a document and lower if\nthe query term appears across many documents in the collection. "
                  },
                  {
                    "type": "substitution_reference",
                    "children": [{
                      "type": "text",
                      "value": "Atlas Search"
                    }],
                    "name": "fts"
                  },
                  {
                    "type": "text",
                    "value": "\nalso supports customizing the relevance-based default score by\nboosting, decaying, or other modifying options. To learn more about\ncustomizing the resulting scores, see "
                  },
                  {
                    "type": "ref_role",
                    "children": [{
                      "type": "text",
                      "value": "Score the Documents in the Results"
                    }],
                    "domain": "std",
                    "name": "label",
                    "target": "scoring-ref",
                    "flag": "",
                    "fileid": [
                      "atlas-search/scoring",
                      "std-label-scoring-ref"
                    ]
                  },
                  {
                    "type": "text",
                    "value": "."
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "type": "section",
        "children": [{
            "type": "heading",
            "children": [{
              "type": "text",
              "value": "Next Steps"
            }],
            "id": "next-steps"
          },
          {
            "type": "paragraph",
            "children": [{
                "type": "text",
                "value": "For hands-on experience creating "
              },
              {
                "type": "substitution_reference",
                "children": [{
                  "type": "text",
                  "value": "Atlas Search"
                }],
                "name": "fts"
              },
              {
                "type": "text",
                "value": " indexes and running "
              },
              {
                "type": "substitution_reference",
                "children": [{
                  "type": "text",
                  "value": "Atlas Search"
                }],
                "name": "fts"
              },
              {
                "type": "text",
                "value": "\nqueries against the "
              },
              {
                "type": "ref_role",
                "children": [{
                  "type": "text",
                  "value": "sample datasets"
                }],
                "domain": "std",
                "name": "doc",
                "target": "",
                "flag": "",
                "fileid": [
                  "/sample-data",
                  ""
                ]
              },
              {
                "type": "text",
                "value": ", try the\ntutorials in the following pages:"
              }
            ]
          },
          {
            "type": "list",
            "children": [{
                "type": "listItem",
                "children": [{
                  "type": "paragraph",
                  "children": [{
                    "type": "ref_role",
                    "children": [{
                        "type": "text",
                        "value": "Get Started with "
                      },
                      {
                        "type": "substitution_reference",
                        "children": [{
                          "type": "text",
                          "value": "Atlas Search"
                        }],
                        "name": "fts"
                      }
                    ],
                    "domain": "std",
                    "name": "label",
                    "target": "fts-tutorial-ref",
                    "flag": "",
                    "fileid": [
                      "atlas-search/tutorial",
                      "std-label-fts-tutorial-ref"
                    ]
                  }]
                }]
              },
              {
                "type": "listItem",
                "children": [{
                  "type": "paragraph",
                  "children": [{
                    "type": "ref_role",
                    "children": [{
                        "type": "substitution_reference",
                        "children": [{
                          "type": "text",
                          "value": "Atlas Search"
                        }],
                        "name": "fts"
                      },
                      {
                        "type": "text",
                        "value": " Tutorials"
                      }
                    ],
                    "domain": "std",
                    "name": "label",
                    "target": "fts-tutorials",
                    "flag": "",
                    "fileid": [
                      "atlas-search/tutorials",
                      "std-label-fts-tutorials"
                    ]
                  }]
                }]
              }
            ],
            "enumtype": "unordered"
          },
          {
            "type": "directive",
            "children": [],
            "domain": "",
            "name": "toctree",
            "argument": [],
            "options": {
              "titlesonly": true
            },
            "entries": [{
              "slug": "/atlas-search/best-practices"
            }]
          }
        ]
      }
    ]
  }
]
