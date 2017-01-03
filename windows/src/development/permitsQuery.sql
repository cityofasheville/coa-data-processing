module.exports = `
SELECT      B1PERMIT.B1_ALT_ID, 
            B1PERMIT.B1_PER_TYPE,
            B1PERMIT.B1_PER_SUB_TYPE,
            B1PERMIT.B1_APP_TYPE_ALIAS, 
            B1PERMIT.B1_PER_CATEGORY,
            R3APPTYP.R1_APP_TYPE_ALIAS,
            R3APPTYP.R1_PROCESS_CODE AS 'Workflow',
		CONVERT(varchar(33), gph.rec_date, 126) AS 'Status Date',
            CONVERT(varchar(33),
                  CASE 
                        WHEN GPH.B1_DUE_DD IS NULL THEN GP.B1_DUE_DD
                        ELSE GPH.B1_DUE_DD END, 126)
                        AS 'Due Date',
            CASE
                  WHEN GP.R1_PROCESS_CODE='ADMIN' THEN 'Application Process'
                  WHEN GP.R1_PROCESS_CODE='DIVISION REVIEW' THEN 'Review Process'
                  WHEN GP.R1_PROCESS_CODE='CLOSE OUT' THEN 'Close Out Process'
                  WHEN GP.R1_PROCESS_CODE='ADHOC TASKS' THEN 'Ad Hoc Tasks'
                  WHEN GP.R1_PROCESS_CODE='MASTER V4' THEN GP.SD_PRO_DES
                  ELSE GP.R1_PROCESS_CODE END 
                  AS 'Process',
            GP.SD_PRO_DES AS 'Task',
            GPH.SD_APP_DES AS 'Status',
            CASE 
                  WHEN GPH.SD_CHK_LV2 IS NULL THEN GP.SD_CHK_LV2
                  ELSE GPH.SD_CHK_LV2 END
                  AS 'Active',
            CASE 
                  WHEN GPH.SD_CHK_LV1 IS NULL THEN GP.SD_CHK_LV1
                  ELSE GPH.SD_CHK_LV1 END
                  AS 'Complete',
            GP.SD_STP_NUM AS 'Step',
            GPH.SD_COMMENT,
            CONVERT(varchar(33), B1PERMIT.REC_DATE, 126) AS 'Application Date',
            B1PERMIT.B1_APPL_STATUS AS 'Application Status', 
            CONVERT(VARCHAR(33), B1PERMIT.B1_APPL_STATUS_DATE, 126) AS 'Application Status Date',
            GPH.SD_AGENCY_CODE,
            GPH.ASGN_AGENCY_CODE,
            GP.R1_PROCESS_CODE 'Original GP R1_PROCESS_CODE',
            GPH.HISTORY_ID,
            CAST (GPH.GPROCESS_HISTORY_SEQ_NBR AS INT) AS SEQ_NBR,
            GPH.PARENTTASKNAME

FROM        GPROCESS as GP INNER JOIN
            B1PERMIT ON 
                  GP.SERV_PROV_CODE = B1PERMIT.SERV_PROV_CODE AND
                  GP.B1_PER_ID1 = B1PERMIT.B1_PER_ID1 AND 
                  GP.B1_PER_ID2 = B1PERMIT.B1_PER_ID2 AND
                  GP.B1_PER_ID3 = B1PERMIT.B1_PER_ID3 INNER JOIN
            R3APPTYP ON B1PERMIT.B1_APP_TYPE_ALIAS = R3APPTYP.R1_APP_TYPE_ALIAS LEFT OUTER JOIN
            GPROCESS_HISTORY AS GPH ON
                  GP.SERV_PROV_CODE=GPH.SERV_PROV_CODE AND
                  GP.B1_PER_ID1 = GPH.B1_PER_ID1 AND 
                  GP.B1_PER_ID2 = GPH.B1_PER_ID2 AND 
                  GPH.B1_PER_ID3 = GPH.B1_PER_ID3 AND 
                  GP.B1_PER_ID3 = GPH.B1_PER_ID3 AND
                  GP.R1_PROCESS_CODE = GPH.R1_PROCESS_CODE AND 
                  GP.SD_PRO_DES = GPH.SD_PRO_DES 

WHERE       (GPH.SD_CHK_LV1 IS NOT NULL OR GP.SD_CHK_LV1 = 'Y') AND -- Otherwise wasn't required
		R3APPTYP.R1_PROCESS_CODE = 'MASTER V4'
		AND B1PERMIT.REC_DATE > '2016-5-1'

ORDER BY    B1PERMIT.B1_ALT_ID,
            CASE
                  WHEN (gp.R1_PROCESS_CODE = 'MASTER V4' AND gp.SD_PRO_DES='Application Process') THEN '1'
                  WHEN (gp.R1_PROCESS_CODE = 'MASTER V4' AND gp.SD_PRO_DES='Review Process')      THEN '2'
                  WHEN (gp.R1_PROCESS_CODE = 'MASTER V4' AND gp.SD_PRO_DES='Close Out Process')   THEN '4'
                  WHEN (gp.R1_PROCESS_CODE = 'MASTER V4' AND gp.SD_PRO_DES='Issuance')            THEN '3'
                  WHEN gp.R1_PROCESS_CODE = 'ADMIN'                                               THEN '1'
                  WHEN gp.R1_PROCESS_CODE = 'DIVISION REVIEW'                                     THEN '2'
                  WHEN gp.R1_PROCESS_CODE = 'CLOSE OUT'                                           THEN '4'
                  WHEN gp.R1_PROCESS_CODE = 'ADHOC TASKS'                                         THEN 'ZZZZZZZZZ'
                  ELSE gp.R1_PROCESS_CODE   END
                  ASC,
            CASE
                  WHEN (GPH.GPROCESS_HISTORY_SEQ_NBR IS NULL)     THEN 9999999999
                  ELSE CONVERT(INT, GPH.GPROCESS_HISTORY_SEQ_NBR) END
                  ASC,
            GP.SD_STP_NUM asc
`;
