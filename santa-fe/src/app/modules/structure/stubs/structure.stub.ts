import { BEPortfolioStructuringDTO } from 'BEModels/backend-models.interface';
import { PortfolioShortNames } from 'Core/constants/structureConstants.constants';

// always remove bics lv 2+ to save space

export const PortfolioStructuringSample: BEPortfolioStructuringDTO = 
{
  "date": "2020-12-07T00:00:00-05:00",
  "portfolioId": 5,
  "portfolioShortName": PortfolioShortNames.FIP,
  "portfolioNav": 837001170.5624204,
  "currentTotals": {
    "Cs01": 140816.58623445002,
    "CreditDuration": 1.6823941373920512,
    "CreditLeverage": 0.7849391613657498
  },
  "indexId": 25,
  "indexShortName": "DEX Short Universe",
  "indexNav": 810244059723.7443,
  "indexTotals": {
    "Cs01": 160144783.74157196,
    "CreditDuration": 1.9765005595495997,
    "CreditLeverage": 0.3379507054299231
  },
  "target": {
    "portfolioTargetId": "afa4bc54-f3f2-44b7-81cf-2ba180526592",
    "date": "2020-12-07T00:00:00",
    "portfolioId": 5,
    "target": {
      "Cs01": 167382.31477197527,
      "CreditDuration": 2.0,
      "CreditLeverage": null
    }
  },
  "breakdowns": {
    "Ccy": {
      "portfolioBreakdownId": "f1836cbc-4759-4990-a9cd-9494f467fa10",
      "date": "2020-12-07T00:00:00-05:00",
      "portfolioId": 5,
      "indexId": 25,
      "groupOption": "Ccy",
      "breakdown": {
        "CAD": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 95894.783147659,
              "currentPct": 0.6809906823618116,
              "indexLevel": 160144783.74157196,
              "indexPct": 1.0
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 1.1456947316241242,
              "currentPct": 0.6809906823618115,
              "indexLevel": 1.9765005595495997,
              "indexPct": 1.0
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.5002538288817171,
              "currentPct": 0.637315416918814,
              "indexLevel": 0.3379507054299231,
              "indexPct": 1.0
            }
          },
          "view": "Neutral"
        },
        "USD": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 44921.803086791,
              "currentPct": 0.3190093176381883,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.5366994057679265,
              "currentPct": 0.3190093176381882,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.2846853324840323,
              "currentPct": 0.36268458308118545,
              "indexLevel": 0.0,
              "indexPct": 0.0
            }
          },
          "view": null
        },
        "EUR": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            }
          },
          "view": null
        },
        "GBP": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            }
          },
          "view": null
        }
      }
    },
    "BicsCodeLevel1": {
      "portfolioBreakdownId": "0c1d41a0-abfa-4746-b8f9-69081cd96dda",
      "date": "2020-12-07T00:00:00-05:00",
      "portfolioId": 5,
      "indexId": 25,
      "groupOption": "BicsCodeLevel1",
      "breakdown": {
        "50": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 1448.8238159999999,
              "currentPct": 0.01028872986302769,
              "indexLevel": 89761455.81081392,
              "indexPct": 0.5605019015521812
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.017309698802768305,
              "currentPct": 0.010288729863027687,
              "indexLevel": 1.1078323220465007,
              "indexPct": 0.5605019015521812
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.02773801453360549,
              "indexPct": 0.08207710203864983
            }
          },
          "view": null
        },
        "None": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            }
          },
          "view": null
        },
        "12": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 12346.583128861,
              "currentPct": 0.0876784721105565,
              "indexLevel": 2209304.168866,
              "indexPct": 0.013795667378284311
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.1475097474542927,
              "currentPct": 0.08767847211055649,
              "indexLevel": 0.027267144292539097,
              "indexPct": 0.01379566737828431
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.053973884122651805,
              "currentPct": 0.06876186942786788,
              "indexLevel": 0.009039565466875786,
              "indexPct": 0.026748177534874875
            }
          },
          "view": null
        },
        "15": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 3529.632673421,
              "currentPct": 0.025065461163391665,
              "indexLevel": 6110369.872825001,
              "indexPct": 0.03815528504934258
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.04216998491231827,
              "currentPct": 0.02506546116339166,
              "indexLevel": 0.07541394224980008,
              "indexPct": 0.038155285049342576
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.04478022850323113,
              "currentPct": 0.05704929847724257,
              "indexLevel": 0.026884650996487455,
              "indexPct": 0.0795519895787352
            }
          },
          "view": null
        },
        "14": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 58579.23356672499,
              "currentPct": 0.41599668855197613,
              "indexLevel": 41636379.2586065,
              "indexPct": 0.25999210393137595
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.6998703899943516,
              "currentPct": 0.4159966885519761,
              "indexLevel": 0.5138745388988422,
              "indexPct": 0.2599921039313759
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.2748109628142615,
              "currentPct": 0.35010479326334787,
              "indexLevel": 0.18355776010617061,
              "indexPct": 0.5431495101413033
            }
          },
          "view": null
        },
        "17": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 2087801.8578200005,
              "indexPct": 0.013036964483271074
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.025767567596013532,
              "indexPct": 0.013036964483271072
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.007618534969518522,
              "indexPct": 0.022543332051420405
            }
          },
          "view": null
        },
        "10": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 28933.387439808,
              "currentPct": 0.20546860432787287,
              "indexLevel": 3625204.5097693084,
              "indexPct": 0.022637043961540173
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.3456791753393403,
              "currentPct": 0.2054686043278728,
              "indexLevel": 0.04474213005653303,
              "indexPct": 0.02263704396154017
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.12591907015523637,
              "currentPct": 0.16041889149236013,
              "indexLevel": 0.017277117724696475,
              "indexPct": 0.051123188817485773
            }
          },
          "view": null
        },
        "19": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 23.636769016000002,
              "currentPct": 0.00016785500663001724,
              "indexLevel": 893757.1146999999,
              "indexPct": 0.005580931790711767
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.00028239827908624484,
              "currentPct": 0.0001678550066300172,
              "indexLevel": 0.011030714807149957,
              "indexPct": 0.005580931790711767
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.006912885302791216,
              "currentPct": 0.008806905863587167,
              "indexLevel": 0.0027967095331406775,
              "indexPct": 0.008275495473763994
            }
          },
          "view": null
        },
        "11": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 2551.65908717,
              "currentPct": 0.01812044415649774,
              "indexLevel": 4321128.361925,
              "indexPct": 0.02698263571855122
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.03048572901583185,
              "currentPct": 0.018120444156497738,
              "indexLevel": 0.053331194595839494,
              "indexPct": 0.026982635718551216
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.028352934877928705,
              "currentPct": 0.036121187823775026,
              "indexLevel": 0.02047173099751627,
              "indexPct": 0.06057608600483083
            }
          },
          "view": null
        },
        "16": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 13240.871607059,
              "currentPct": 0.09402920466353197,
              "indexLevel": 84806.781325,
              "indexPct": 0.000529563182412822
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.1581941826695635,
              "currentPct": 0.09402920466353197,
              "indexLevel": 0.0010466819263558092,
              "indexPct": 0.0005295631824128219
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.05560351302434123,
              "currentPct": 0.07083799071458514,
              "indexLevel": 0.0005550375668577347,
              "indexPct": 0.0016423625041754094
            }
          },
          "view": null
        },
        "13": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 5286.220196675,
              "currentPct": 0.03753975535150244,
              "indexLevel": 4417623.178420999,
              "indexPct": 0.027585183077519303
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.06315666432249957,
              "currentPct": 0.03753975535150243,
              "indexLevel": 0.05452212978799504,
              "indexPct": 0.027585183077519296
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0744414466899044,
              "currentPct": 0.09483721841624068,
              "indexLevel": 0.019933804081805707,
              "indexPct": 0.05898435411296736
            }
          },
          "view": null
        },
        "20": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 14876.537949715,
              "currentPct": 0.1056447848050128,
              "indexLevel": 4832038.074680312,
              "indexPct": 0.030172934527033013
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.17773616660199837,
              "currentPct": 0.10564478480501278,
              "indexLevel": 0.05963682197593418,
              "indexPct": 0.03017293452703301
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.12014423587540317,
              "currentPct": 0.15306184452099317,
              "indexLevel": 0.021418199953236735,
              "indexPct": 0.06337669846254539
            }
          },
          "view": null
        },
        "18": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 164914.75182,
              "indexPct": 0.0010297853477770804
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.002035371316097378,
              "indexPct": 0.0010297853477770802
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.000659579500011654,
              "indexPct": 0.0019517032792476987
            }
          },
          "view": null
        }
      }
    },
    "RatingNoNotch": {
      "portfolioBreakdownId": "aa8390a0-63a7-4d79-bf1b-e4e3b1400b20",
      "date": "2020-12-07T00:00:00-05:00",
      "portfolioId": 5,
      "indexId": 25,
      "groupOption": "RatingNoNotch",
      "breakdown": {
        "AAA": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 44365679.23511027,
              "indexPct": 0.27703480687016213
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.5475594507935906,
              "indexPct": 0.2770348068701621
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.03026257900948661,
              "indexPct": 0.08954731717748052
            }
          },
          "view": null
        },
        "NR": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            }
          },
          "view": null
        },
        "AA": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 7179.737777946,
              "currentPct": 0.050986449607521564,
              "indexLevel": 66622010.3079309,
              "indexPct": 0.4160111166370541
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0857793039061295,
              "currentPct": 0.05098644960752155,
              "indexLevel": 0.8222462048119911,
              "indexPct": 0.41601111663705403
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.01934610063628628,
              "currentPct": 0.02464662433534996,
              "indexLevel": 0.10113945392312847,
              "indexPct": 0.2992728001394883
            }
          },
          "view": null
        },
        "BB": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 145224.33185,
              "indexPct": 0.0009068314837175756
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0017923529349849817,
              "indexPct": 0.0009068314837175755
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.000418309413605032,
              "indexPct": 0.001237782335956011
            }
          },
          "view": null
        },
        "A": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 46995.412957342,
              "currentPct": 0.33373492579274605,
              "indexLevel": 25040407.022233497,
              "indexPct": 0.15636105302462788
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.5614736825966871,
              "currentPct": 0.33373492579274594,
              "indexLevel": 0.3090477087949416,
              "indexPct": 0.15636105302462786
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.235266201966623,
              "currentPct": 0.2997253972617102,
              "indexLevel": 0.10070917857278561,
              "indexPct": 0.2979996104599595
            }
          },
          "view": null
        },
        "BBB": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 86641.43549916199,
              "currentPct": 0.6152786245997321,
              "indexLevel": 23971462.844447363,
              "indexPct": 0.14968619198443872
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 1.035141150889234,
              "currentPct": 0.6152786245997321,
              "indexLevel": 0.2958548422140919,
              "indexPct": 0.14968619198443872
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.5303268587628402,
              "currentPct": 0.6756279784029395,
              "indexLevel": 0.1054211845109174,
              "indexPct": 0.3119424898871157
            }
          },
          "view": null
        },
        "CCC": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            }
          },
          "view": null
        },
        "B": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            }
          },
          "view": null
        },
        "D": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            }
          },
          "view": null
        },
        "CC": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            }
          },
          "view": null
        },
        "C": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            }
          },
          "view": null
        }
      }
    },
    "Tenor": {
      "portfolioBreakdownId": "c3f4bc2c-20f7-4b90-b706-e4737facceb0",
      "date": "2020-12-07T00:00:00-05:00",
      "portfolioId": 5,
      "indexId": 25,
      "groupOption": "Tenor",
      "breakdown": {
        "2Y": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 44349.290906223,
              "currentPct": 0.31494365892654475,
              "indexLevel": 34364738.55604251,
              "indexPct": 0.2145854379590496
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.5298593653868207,
              "currentPct": 0.31494365892654475,
              "indexLevel": 0.42412823819725737,
              "indexPct": 0.21458543795904955
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.39955222715452665,
              "currentPct": 0.5090231788911237,
              "indexLevel": 0.12024367700735226,
              "indexPct": 0.35580241459885276
            }
          },
          "view": null
        },
        "5Y": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 60139517.885575436,
              "indexPct": 0.3755321683322729
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.7422395408376117,
              "indexPct": 0.3755321683322728
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0771195601171429,
              "indexPct": 0.2281976598304047
            }
          },
          "view": null
        },
        "3Y": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 96467.29532822702,
              "currentPct": 0.6850563410734553,
              "indexLevel": 65640527.299954124,
              "indexPct": 0.4098823937086782
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 1.1525347720052306,
              "currentPct": 0.6850563410734553,
              "indexLevel": 0.8101327805147317,
              "indexPct": 0.4098823937086782
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.385386934211223,
              "currentPct": 0.49097682110887614,
              "indexLevel": 0.14058746830542793,
              "indexPct": 0.41599992557074245
            }
          },
          "view": null
        },
        "30Y": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            }
          },
          "view": null
        },
        "7Y": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            }
          },
          "view": null
        },
        "10Y": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            }
          },
          "view": null
        },
        "20Y": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            }
          },
          "view": null
        }
      }
    }
  },
  "overrides": [
    {
      "portfolioOverrideId": "485f7c29-b344-4de8-8aba-eef5e28494af",
      "date": "2020-12-07T00:00:00",
      "portfolioId": 5,
      "indexId": 25,
      "bucket": {
        "Ccy": [
          "USD"
        ],
        "Tenor": [
          "10Y",
          "20Y",
          "2Y",
          "30Y",
          "3Y",
          "5Y",
          "7Y"
        ],
        "CouponType": [
          "Float"
        ]
      },
      "simpleBucket": {
        "Ccy": [
          "USD"
        ],
        "Tenor": [
          "10Y",
          "20Y",
          "2Y",
          "30Y",
          "3Y",
          "5Y",
          "7Y"
        ],
        "CouponType": [
          "Float"
        ]
      },
      "title": "USD FRNs",
      "breakdown": {
        "metricBreakdowns": {
          "Cs01": {
            "targetLevel": null,
            "targetPct": null,
            "currentLevel": 34888.716493622,
            "currentPct": 0.24775999352473055,
            "indexLevel": 0.0,
            "indexPct": 0.0
          },
          "CreditDuration": {
            "targetLevel": null,
            "targetPct": null,
            "currentLevel": 0.41682996058629923,
            "currentPct": 0.24775999352473055,
            "indexLevel": 0.0,
            "indexPct": 0.0
          },
          "CreditLeverage": {
            "targetLevel": null,
            "targetPct": null,
            "currentLevel": 0.1719628235319327,
            "currentPct": 0.21907790055056892,
            "indexLevel": 0.0,
            "indexPct": 0.0
          }
        },
        "view": null
      }
    },
    {
      "portfolioOverrideId": "4b62b2d8-c306-4e6b-af8a-75f1ce52b52c",
      "date": "2020-12-07T00:00:00",
      "portfolioId": 5,
      "indexId": 25,
      "bucket": {
        "Ticker": [
          "A",
          "ABMD",
          "AJG",
          "AMGN",
          "ATVI",
          "AVGO",
          "CB",
          "CCL",
          "CDNS",
          "COO",
          "CTXS",
          "DXC",
          "ETN",
          "GE",
          "GM",
          "GOOGL",
          "HIG",
          "INFO",
          "IPG",
          "JCI",
          "KO",
          "LNT",
          "LRCX",
          "LVS",
          "MCHP",
          "MDLZ",
          "MET",
          "MOS",
          "NCLH",
          "NFLX",
          "NVDA",
          "OKE",
          "PFG",
          "PKI",
          "RE",
          "SLB",
          "SNPS",
          "SRE",
          "STX",
          "STZ",
          "TAP",
          "TMO",
          "UAL",
          "VTRS",
          "VZ",
          "WDC",
          "WLTW",
          "WU",
          "WYNN",
          "XLNX"
        ]
      },
      "simpleBucket": {
        "Ticker": [
          "A",
          "ABMD",
          "AJG",
          "AMGN",
          "ATVI",
          "AVGO",
          "CB",
          "CCL",
          "CDNS",
          "COO",
          "CTXS",
          "DXC",
          "ETN",
          "GE",
          "GM",
          "GOOGL",
          "HIG",
          "INFO",
          "IPG",
          "JCI",
          "KO",
          "LNT",
          "LRCX",
          "LVS",
          "MCHP",
          "MDLZ",
          "MET",
          "MOS",
          "NCLH",
          "NFLX",
          "NVDA",
          "OKE",
          "PFG",
          "PKI",
          "RE",
          "SLB",
          "SNPS",
          "SRE",
          "STX",
          "STZ",
          "TAP",
          "TMO",
          "UAL",
          "VTRS",
          "VZ",
          "WDC",
          "WLTW",
          "WU",
          "WYNN",
          "XLNX"
        ]
      },
      "title": "Biden Tax Increases",
      "breakdown": {
        "metricBreakdowns": {
          "Cs01": {
            "targetLevel": null,
            "targetPct": null,
            "currentLevel": 541.05422276,
            "currentPct": 0.0038422620319681776,
            "indexLevel": 439321.50165,
            "indexPct": 0.002743276998387532
          },
          "CreditDuration": {
            "targetLevel": null,
            "targetPct": null,
            "currentLevel": 0.0064641991169073305,
            "currentPct": 0.0038422620319681767,
            "indexLevel": 0.005422088522312503,
            "indexPct": 0.002743276998387532
          },
          "CreditLeverage": {
            "targetLevel": null,
            "targetPct": null,
            "currentLevel": 0.004410222014647364,
            "currentPct": 0.005618552662060875,
            "indexLevel": 0.002697945696442777,
            "indexPct": 0.00798325215214625
          }
        },
        "view": null
      }
    },
    {
      "portfolioOverrideId": "81c1087b-5308-4ef7-879a-a57efe28c4a7",
      "date": "2020-12-07T00:00:00",
      "portfolioId": 5,
      "indexId": 25,
      "bucket": {
        "Ccy": [
          "USD"
        ],
        "Tenor": [
          "10Y",
          "20Y",
          "30Y",
          "3Y",
          "5Y",
          "7Y"
        ],
        "CouponType": [
          "Float"
        ]
      },
      "simpleBucket": {
        "Ccy": [
          "USD"
        ],
        "Tenor": [
          "10Y",
          "20Y",
          "30Y",
          "3Y",
          "5Y",
          "7Y"
        ],
        "CouponType": [
          "Float"
        ]
      },
      "title": "USD FRNs Beyond Libor Cessation",
      "breakdown": {
        "metricBreakdowns": {
          "Cs01": {
            "targetLevel": null,
            "targetPct": null,
            "currentLevel": 20405.500068536996,
            "currentPct": 0.14490835642445718,
            "indexLevel": 0.0,
            "indexPct": 0.0
          },
          "CreditDuration": {
            "targetLevel": null,
            "targetPct": null,
            "currentLevel": 0.24379296930762454,
            "currentPct": 0.14490835642445718,
            "indexLevel": 0.0,
            "indexPct": 0.0
          },
          "CreditLeverage": {
            "targetLevel": null,
            "targetPct": null,
            "currentLevel": 0.08705228353655392,
            "currentPct": 0.11090322386908033,
            "indexLevel": 0.0,
            "indexPct": 0.0
          }
        },
        "view": null
      }
    },
    {
      "portfolioOverrideId": "85a3b98a-a62d-43d4-96bd-3e62e49fd41c",
      "date": "2020-12-07T00:00:00",
      "portfolioId": 5,
      "indexId": 25,
      "bucket": {
        "BicsCode": [
          "101010",
          "10101010",
          "101011",
          "10101110",
          "101012",
          "10101210",
          "10101211",
          "10101212",
          "101014",
          "10101410",
          "101110",
          "10111010",
          "10111011",
          "111110",
          "11111010",
          "11111011",
          "11111012",
          "11111013",
          "11111014",
          "11111015",
          "11111016",
          "11111017",
          "11111018",
          "111211",
          "11121110",
          "11121111",
          "11121112",
          "11121113",
          "11121114",
          "11121115",
          "11121116",
          "11121117",
          "11121118",
          "121111",
          "12111110",
          "12111111",
          "141010",
          "14101010",
          "14101011",
          "171111",
          "17111110",
          "17111111",
          "17111112",
          "17111113",
          "17111114",
          "17111115",
          "17111116",
          "171112",
          "17111210",
          "17111211",
          "17111212",
          "17111213",
          "17111214",
          "17111215",
          "17111216",
          "17111217",
          "17111218",
          "191010",
          "19101010",
          "19101011",
          "19101012",
          "19101013",
          "19101014",
          "19101015",
          "19101016",
          "191011",
          "19101110",
          "19101111"
        ]
      },
      "simpleBucket": {
        "BicsCode": [
          "101010",
          "101011",
          "101012",
          "101014",
          "101110",
          "111110",
          "111211",
          "121111",
          "141010",
          "171111",
          "171112",
          "191010",
          "191011",
          "14101010"
        ]
      },
      "title": "Biden Tax Increases",
      "breakdown": {
        "metricBreakdowns": {
          "Cs01": {
            "targetLevel": null,
            "targetPct": null,
            "currentLevel": 82037.156364245,
            "currentPct": 0.5825816301757147,
            "indexLevel": 42525372.26702316,
            "indexPct": 0.26554328697740787
          },
          "CreditDuration": {
            "targetLevel": null,
            "targetPct": null,
            "currentLevel": 0.9801319191599266,
            "currentPct": 0.5825816301757147,
            "indexLevel": 0.5248464552954865,
            "indexPct": 0.2655432869774078
          },
          "CreditLeverage": {
            "targetLevel": null,
            "targetPct": null,
            "currentLevel": 0.3665827918086327,
            "currentPct": 0.4670206429384913,
            "indexLevel": 0.1866837075973369,
            "indexPct": 0.5523992244959149
          }
        },
        "view": null
      }
    },
    {
      "portfolioOverrideId": "9afc367d-70f7-4d89-b566-a9d5d7bf2c41",
      "date": "2020-12-07T00:00:00",
      "portfolioId": 5,
      "indexId": 25,
      "bucket": {
        "Country": [
          "Ireland",
          "United Kingdom Great"
        ],
        "BicsLevel1": [
          "Financials"
        ]
      },
      "simpleBucket": {
        "Country": [
          "Ireland",
          "United Kingdom Great"
        ],
        "BicsLevel1": [
          "Financials"
        ]
      },
      "title": "UK Fins",
      "breakdown": {
        "metricBreakdowns": {
          "Cs01": {
            "targetLevel": null,
            "targetPct": null,
            "currentLevel": 9261.633188701,
            "currentPct": 0.06577089699704133,
            "indexLevel": 0.0,
            "indexPct": 0.0
          },
          "CreditDuration": {
            "targetLevel": null,
            "targetPct": null,
            "currentLevel": 0.1106525715188388,
            "currentPct": 0.06577089699704133,
            "indexLevel": 0.0,
            "indexPct": 0.0
          },
          "CreditLeverage": {
            "targetLevel": null,
            "targetPct": null,
            "currentLevel": 0.04345529155914257,
            "currentPct": 0.05536134989561843,
            "indexLevel": 0.0,
            "indexPct": 0.0
          }
        },
        "view": "Positive"
      }
    },
    {
      "portfolioOverrideId": "a6f76027-b9e9-4cdf-82eb-9aaf524bca7c",
      "date": "2020-12-07T00:00:00",
      "portfolioId": 5,
      "indexId": 25,
      "bucket": {
        "BicsLevel4": [
          "Agricultural Chemicals",
          "Aircraft & Parts",
          "Airlines",
          "Auto Parts",
          "Automobiles",
          "Automotive Retailers",
          "Base Metals",
          "Building Construction",
          "Building Maintenance Services",
          "Building Materials",
          "Building Products",
          "Cable & Satellite",
          "Casinos & Gaming",
          "Cement & Aggregates",
          "Chemicals Distribution",
          "Commercial Finance",
          "Commercial Vehicles",
          "Consumer Finance",
          "Consumer Goods Rental",
          "Containers & Packaging",
          "Courier Services",
          "Data Center REIT",
          "Defense",
          "Department Stores",
          "Diversified Industrials",
          "Drilling & Drilling Support",
          "Educational Services",
          "Electronics & Appliances Stores",
          "Engineering Services",
          "Entertainment Facilities",
          "Exploration & Production",
          "Fabricated Metal & Hardware",
          "Film & TV",
          "Food Services",
          "Furniture",
          "Gaming REIT",
          "Health Care Owners & Develop",
          "Health Care REIT",
          "Home Products Stores",
          "Homebuilding",
          "Hotel REIT",
          "Household Appliances",
          "Industrial Owners & Developers",
          "Industrial REIT",
          "Industrial Wholesale & Rental",
          "Infrastructure Construction",
          "Infrastructure REIT",
          "Integrated Oils",
          "Iron",
          "Local TV & Radio Broadcast",
          "Lodging",
          "Logistics Services",
          "Marine Shipping",
          "Metal Svc Centers & Processors",
          "Midstream - Oil & Gas",
          "Mineral & Precious Stone Mining",
          "Mining Services",
          "Multi Asset Class Owners & Develop",
          "Multi Asset Class REIT",
          "Music",
          "Non-Profit Organization",
          "Office Owners & Developers",
          "Office REIT",
          "Oilfield Services & Equipment",
          "Other Commercial Support Svcs",
          "Paper & Pulp Mills",
          "Precious Metals",
          "Professional Services",
          "Publishing",
          "Rail Freight",
          "Railroad Rolling Stock",
          "Real Estate Services",
          "Refining & Marketing",
          "Residential Owners & Developers",
          "Residential REIT",
          "Restaurants",
          "Retail Owners & Developers",
          "Retail REIT",
          "Security Services",
          "Self-Storage REIT",
          "Specialty Apparel Stores",
          "Specialty Chemicals",
          "Specialty REIT",
          "Steel Producers",
          "Timber REIT",
          "Toys & Games",
          "Transit Services",
          "Transport Operations & Services",
          "Trucking",
          "Video Games",
          "Waste Management"
        ]
      },
      "simpleBucket": {
        "BicsLevel4": [
          "Agricultural Chemicals",
          "Aircraft & Parts",
          "Airlines",
          "Auto Parts",
          "Automobiles",
          "Automotive Retailers",
          "Base Metals",
          "Building Construction",
          "Building Maintenance Services",
          "Building Materials",
          "Building Products",
          "Cable & Satellite",
          "Casinos & Gaming",
          "Cement & Aggregates",
          "Chemicals Distribution",
          "Commercial Finance",
          "Commercial Vehicles",
          "Consumer Finance",
          "Consumer Goods Rental",
          "Containers & Packaging",
          "Courier Services",
          "Data Center REIT",
          "Defense",
          "Department Stores",
          "Diversified Industrials",
          "Drilling & Drilling Support",
          "Educational Services",
          "Electronics & Appliances Stores",
          "Engineering Services",
          "Entertainment Facilities",
          "Exploration & Production",
          "Fabricated Metal & Hardware",
          "Film & TV",
          "Food Services",
          "Furniture",
          "Gaming REIT",
          "Health Care Owners & Develop",
          "Health Care REIT",
          "Home Products Stores",
          "Homebuilding",
          "Hotel REIT",
          "Household Appliances",
          "Industrial Owners & Developers",
          "Industrial REIT",
          "Industrial Wholesale & Rental",
          "Infrastructure Construction",
          "Infrastructure REIT",
          "Integrated Oils",
          "Iron",
          "Local TV & Radio Broadcast",
          "Lodging",
          "Logistics Services",
          "Marine Shipping",
          "Metal Svc Centers & Processors",
          "Midstream - Oil & Gas",
          "Mineral & Precious Stone Mining",
          "Mining Services",
          "Multi Asset Class Owners & Develop",
          "Multi Asset Class REIT",
          "Music",
          "Non-Profit Organization",
          "Office Owners & Developers",
          "Office REIT",
          "Oilfield Services & Equipment",
          "Other Commercial Support Svcs",
          "Paper & Pulp Mills",
          "Precious Metals",
          "Professional Services",
          "Publishing",
          "Rail Freight",
          "Railroad Rolling Stock",
          "Real Estate Services",
          "Refining & Marketing",
          "Residential Owners & Developers",
          "Residential REIT",
          "Restaurants",
          "Retail Owners & Developers",
          "Retail REIT",
          "Security Services",
          "Self-Storage REIT",
          "Specialty Apparel Stores",
          "Specialty Chemicals",
          "Specialty REIT",
          "Steel Producers",
          "Timber REIT",
          "Toys & Games",
          "Transit Services",
          "Transport Operations & Services",
          "Trucking",
          "Video Games",
          "Waste Management"
        ]
      },
      "title": "COVID Sensitive",
      "breakdown": {
        "metricBreakdowns": {
          "Cs01": {
            "targetLevel": null,
            "targetPct": null,
            "currentLevel": 23560.934835885,
            "currentPct": 0.16731647503979147,
            "indexLevel": 15907754.365033604,
            "indexPct": 0.09933357798718057
          },
          "CreditDuration": {
            "targetLevel": null,
            "targetPct": null,
            "currentLevel": 0.2814922566960486,
            "currentPct": 0.16731647503979144,
            "indexLevel": 0.19633287247372613,
            "indexPct": 0.09933357798718054
          },
          "CreditLeverage": {
            "targetLevel": null,
            "targetPct": null,
            "currentLevel": 0.20506354614373595,
            "currentPct": 0.2612476943906544,
            "indexLevel": 0.0701251742724402,
            "indexPct": 0.2075011921730734
          }
        },
        "view": null
      }
    },
    {
      "portfolioOverrideId": "e78705d6-abee-4da7-9ca5-4ca0bc80a50e",
      "date": "2020-12-07T00:00:00",
      "portfolioId": 5,
      "indexId": 25,
      "bucket": {
        "BicsLevel4": [
          "Aircraft & Parts",
          "Auto Parts",
          "Automobiles",
          "Casinos & Gaming",
          "Commercial Finance",
          "Cruise Lines",
          "Data Center REIT",
          "Defense",
          "Entertainment Facilities",
          "Gaming REIT",
          "Health Care Owners & Develop",
          "Health Care REIT",
          "Hotel Owners & Developers",
          "Hotel REIT",
          "Industrial Owners & Developers",
          "Industrial REIT",
          "Infrastructure REIT",
          "Lodging",
          "Multi Asset Class Own & Develop",
          "Multi Asset Class REIT",
          "Office Owners & Developers",
          "Office REIT",
          "Real Estate Services",
          "Residential Owners & Developers",
          "Residential REIT",
          "Restaurants",
          "Retail Owners & Developers",
          "Retail REIT",
          "Self-Storage Owners & Develop",
          "Self-Storage REIT",
          "Specialty Owners & Developers",
          "Specialty REIT",
          "Timber REIT",
          "Travel Services"
        ]
      },
      "simpleBucket": {
        "BicsLevel4": [
          "Aircraft & Parts",
          "Auto Parts",
          "Automobiles",
          "Casinos & Gaming",
          "Commercial Finance",
          "Cruise Lines",
          "Data Center REIT",
          "Defense",
          "Entertainment Facilities",
          "Gaming REIT",
          "Health Care Owners & Develop",
          "Health Care REIT",
          "Hotel Owners & Developers",
          "Hotel REIT",
          "Industrial Owners & Developers",
          "Industrial REIT",
          "Infrastructure REIT",
          "Lodging",
          "Multi Asset Class Own & Develop",
          "Multi Asset Class REIT",
          "Office Owners & Developers",
          "Office REIT",
          "Real Estate Services",
          "Residential Owners & Developers",
          "Residential REIT",
          "Restaurants",
          "Retail Owners & Developers",
          "Retail REIT",
          "Self-Storage Owners & Develop",
          "Self-Storage REIT",
          "Specialty Owners & Developers",
          "Specialty REIT",
          "Timber REIT",
          "Travel Services"
        ]
      },
      "title": "Targeted COVID",
      "breakdown": {
        "metricBreakdowns": {
          "Cs01": {
            "targetLevel": null,
            "targetPct": null,
            "currentLevel": 5519.773463281,
            "currentPct": 0.039198318968554975,
            "indexLevel": 10270544.013850002,
            "indexPct": 0.06413286635937973
          },
          "CreditDuration": {
            "targetLevel": null,
            "targetPct": null,
            "currentLevel": 0.06594702202832052,
            "currentPct": 0.03919831896855497,
            "indexLevel": 0.1267586462448337,
            "indexPct": 0.06413286635937972
          },
          "CreditLeverage": {
            "targetLevel": null,
            "targetPct": null,
            "currentLevel": 0.07033560090508038,
            "currentPct": 0.08960643622710887,
            "indexLevel": 0.046948694163360914,
            "indexPct": 0.1389217226329954
          }
        },
        "view": null
      }
    }
  ],
  "isIndexValid": true
}