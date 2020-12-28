USE [db_visual_mirassol_teste]
GO

/****** Object:  StoredProcedure [dbo].[PI_BAIXA_PV]    Script Date: 12/06/2020 10:42:00 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO
-- ==========================================================================================
-- CREATE DATE: 13/05/2020
-- DESCRIPTION:	ATUALIZA O STATUS DA PV PARA BAIXADO, QUANDO O STATUS DA PV FOR EM ANDAMENTO
-- PARAMETROS DE ENTRADA: CODIGO DA FILIAL DO PEDIDO,
-- NUMERO PEDIDO (PEDIDO INTEGRATOR), 
-- PARAMETRO DE SAIDA: STATUS DA ATUALIZAÇÃO = OK=COM SUCESSO, DFIERENTE DE OK HOUVERAM ERROS
-- ==========================================================================================
CREATE PROCEDURE [dbo].[PI_BAIXA_PV]
                 @P_CODFIL SMALLINT,
                 @P_NUMEROPEDIDO NVARCHAR(250),
                 @P_USUARIO VARCHAR(20),
				 @P_RETORNO NVARCHAR(500) OUTPUT
AS
BEGIN
		
	SET NOCOUNT ON;
	SET XACT_ABORT ON;

    DECLARE @ERR_MESSAGE NVARCHAR(250),
			@AUX INT,
	        @SITUAC_PV CHAR,
			@NUMEROPEDIDO NVARCHAR(250),
			@CODIGOFILIAL INT, 
			@PV INT;
	BEGIN TRY
		--
		SET @ERR_MESSAGE = 'PV INEXISTENTE OU NÃO ENCONTRA-SE EM VIAGEM';

		SET @AUX = (SELECT COUNT(*) FROM (
		SELECT     
			CASE WHEN (PRC.CODTOM NOT IN (125,148,149,151,152,154,155,157) 
                       OR (PRC.CODTOM IN (125,148,149,151,152,154,155,157)
                       AND ISNULL(IPR.ORDCOM,' ') =  ' '))
            THEN CAST(PRC.CODIGO AS VARCHAR(10))
            ELSE IPR.ORDCOM END "NUMEROPEDIDO",
            PRC.CODFIL  "CODIGOFILIAL",
			LPR.CODLPR PV,
		  	CASE WHEN ISNULL(LPR.SITUAC,'X') = 'X' THEN 'PV INEXISTENTE'
		  		 WHEN ISNULL(LPR.SITUAC,'X') NOT IN ('E')  THEN 'PV NÃO ENCONTRA-SE EM VIAGEM STATUS:' + LPR.SITUAC
		  		 WHEN ISNULL(LPR.SITUAC,'X') = 'E'  THEN 'OK'
		  	END AS MENSAGEM		
		FROM RODPRC PRC 
		LEFT JOIN RODIPR IPR ON (IPR.CODIGO = PRC.CODIGO )
		LEFT JOIN RODDPR DPR ON (PRC.CODFIL = DPR.FILPRO
		                         AND PRC.CODIGO = DPR.CODPRO
		                         AND DPR.TIPDOC = 'V'
		                         AND DPR.TIPPRO = 'C')
		LEFT JOIN RODLPR LPR ON (DPR.CODDOC = LPR.CODLPR
		                         AND DPR.FILDOC = LPR.CODFIL))P
		WHERE NUMEROPEDIDO = @P_NUMEROPEDIDO  AND CODIGOFILIAL = @P_CODFIL AND MENSAGEM <> 'OK');

	   IF @AUX > 0
		  BEGIN
	        RAISERROR (@ERR_MESSAGE, 11,1);
		  END;
	   --
	END TRY
	BEGIN CATCH
	    SET @P_RETORNO = @ERR_MESSAGE;
	    RETURN;
	END CATCH
	--
	BEGIN TRY
	    --
	    BEGIN TRANSACTION	
				
		DECLARE CURSOR_PV CURSOR
		FOR 

		SELECT * FROM (
		SELECT     
			CASE WHEN (PRC.CODTOM NOT IN (125,148,149,151,152,154,155,157) 
                       OR (PRC.CODTOM IN (125,148,149,151,152,154,155,157)
                       AND ISNULL(IPR.ORDCOM,' ') =  ' '))
            THEN CAST(PRC.CODIGO AS VARCHAR(10))
            ELSE IPR.ORDCOM END "NUMEROPEDIDO",
            PRC.CODFIL  "CODIGOFILIAL",
			LPR.CODLPR "PV"		  		
		FROM RODPRC PRC 
		LEFT JOIN RODIPR IPR ON (IPR.CODIGO = PRC.CODIGO )
		LEFT JOIN RODDPR DPR ON (PRC.CODFIL = DPR.FILPRO
		                         AND PRC.CODIGO = DPR.CODPRO
		                         AND DPR.TIPDOC = 'V'
		                         AND DPR.TIPPRO = 'C')
		LEFT JOIN RODLPR LPR ON (DPR.CODDOC = LPR.CODLPR
		                         AND DPR.FILDOC = LPR.CODFIL))P
		WHERE NUMEROPEDIDO = @P_NUMEROPEDIDO  AND CODIGOFILIAL = @P_CODFIL

		OPEN CURSOR_PV;
				
		FETCH NEXT FROM CURSOR_PV INTO 
			@NUMEROPEDIDO,
			@CODIGOFILIAL, 
			@PV
			

		WHILE @@FETCH_STATUS = 0
		BEGIN
		   --
		   -- Trativa para verificar se existe manifesto de carga baixado
		   --
		   IF EXISTS
			--
			-- Localiza o manifesto de carga com base na PV-Programação de veículo
			-- associado ao documento OST-ORDEM DE SERVIÇO DE COLETA
			--
			(SELECT 
			   distinct -- Foi colocado devido duplicidades encontradas na tabela roddpr
			   MAN.CODFIL "codigoFilialManifesto",
			   MAN.CODMAN "codigoManifestoCarga",   
			   MAN.SERMAN "serieManifestoCarga"
			FROM RODLPR LPR -- Programação do veiculo
			LEFT OUTER JOIN RODCLI CLI on CLI.CODCLIFOR = LPR.CODTOM -- cad. de parceiro comercial (tomador)
			LEFT OUTER JOIN RODCLI CLIR on CLIR.CODCLIFOR = LPR.CODREM -- cad. de parceiro comercial (cliente carga)
			INNER JOIN RODDPR DPR ON DPR.TIPPRO='V' -- Associativa PV vs Docs
								 AND DPR.FILPRO=LPR.CODFIL 
								 AND DPR.CODPRO=LPR.CODLPR
								 AND DPR.TIPDOC = 'O' -- FIXADO OST                                           
			INNER JOIN RODORD OST ON OST.CODIGO = DPR.CODDOC -- ORD=ORDEM DE COLETA
								 AND OST.CODFIL = DPR.FILDOC
								 AND OST.SERORD = DPR.SERDOC 												 
			LEFT OUTER JOIN RODORC ORC ON ORC.FILORD = OST.CODFIL -- Associativa OST vs CTE
									  AND ORC.SERORD = OST.SERORD
									  AND ORC.CODORD = OST.CODIGO
			LEFT OUTER JOIN RODCON CTE ON CTE.CODCON = ORC.CODCON -- Recupera a CTE com base na OST (associativa)
									  AND CTE.CODFIL = ORC.FILCON
									  AND CTE.SERCON = ORC.SERCON
			LEFT OUTER JOIN RODIMA IMA ON -- Busca o manifesto com base na OST OU CTE(OST)
										  (IMA.FILDOC = OST.CODFIL --Associativa Manifesto VS Docs OST
									   AND IMA.SERDOC = OST.SERORD 
									   AND IMA.CODDOC = OST.CODIGO 
									   AND IMA.TIPDOC='O') -- OST
										OR 
										  (IMA.FILDOC = CTE.CODFIL -- Associativa Manifesto VS Docs CTE     
									   AND IMA.SERDOC = CTE.SERCON 
									   AND IMA.CODDOC = CTE.CODCON 
									   AND IMA.TIPDOC='C') -- CTE                                          
			LEFT OUTER JOIN RODMAN MAN ON MAN.CODMAN = IMA.CODMAN 
									  AND MAN.SERMAN = IMA.SERMAN 
									  AND MAN.CODFIL = IMA.FILMAN
			WHERE LPR.CODFIL = @CODIGOFILIAL  -- Informar a filial da programação do veículo
			and LPR.CODLPR = @PV -- Informar o numero da programção do veículo
			and MAN.SITUAC = 'B' -- Baixado
			UNION ALL
			--
			-- Localiza o manifesto de carga com base na PV-Programação de veículo
			-- associado ao documento ACT-Coleta de Container
			--
			SELECT 
			   distinct -- Foi colocado devido duplicidades encontradas na tabela roddpr
			   MAN.CODFIL "codigoFilialManifesto",
			   MAN.CODMAN "codigoManifestoCarga",   
			   MAN.SERMAN "serieManifestoCarga"
			FROM RODLPR LPR -- Programação do veiculo
			INNER JOIN RODDPR DPR ON DPR.TIPPRO='V' -- Associativa PV vs Docs
								 AND DPR.FILPRO=LPR.CODFIL 
								 AND DPR.CODPRO=LPR.CODLPR
								 AND DPR.TIPDOC = 'A' -- FIXADO ACT    
			--										                                           
			INNER JOIN RODCOL ACT ON ACT.CODIGO = DPR.CODDOC -- ORD=ORDEM DE COLETA
								 AND ACT.CODFIL = DPR.FILDOC
								 AND ACT.SERCOL = DPR.SERDOC 	
			--																		
			LEFT OUTER JOIN RODCOC COC ON COC.FILCON = ACT.CODFIL -- Associativa ACT vs CTE
									  AND COC.CODCOL = ACT.CODIGO
									  AND COC.SERCOL = ACT.SERCOL
			--                                                 
			LEFT OUTER JOIN RODCON CTE ON CTE.CODCON = COC.CODCON -- Recupera a CTE com base na ACT (associativa)
									  AND CTE.CODFIL = COC.FILCON
									  AND CTE.SERCON = COC.SERCON                                               
			--                                                 
			LEFT OUTER JOIN RODIMA IMA ON -- Busca o manifesto com base na ACT OU CTE(ACT)
										(IMA.FILDOC = ACT.CODFIL --Associativa Manifesto VS Docs OST
									 AND IMA.SERDOC = ACT.SERCOL 
									 AND IMA.CODDOC = ACT.CODIGO 
									 AND IMA.TIPDOC='A') -- ACT
									 OR 
										(IMA.FILDOC = CTE.CODFIL -- Associativa Manifesto VS Docs CTE     
									 AND IMA.SERDOC = CTE.SERCON 
									 AND IMA.CODDOC = CTE.CODCON 
									 AND IMA.TIPDOC='C') -- CTE                                          
			LEFT OUTER JOIN RODMAN MAN ON MAN.CODMAN = IMA.CODMAN 
									 AND MAN.SERMAN = IMA.SERMAN 
									 AND MAN.CODFIL = IMA.FILMAN
			WHERE LPR.CODFIL = @CODIGOFILIAL  -- Informar a filial da programação do veículo
			and LPR.CODLPR = @PV -- Informar o numero da programção do veículo
			and MAN.SITUAC = 'B' -- Baixado
			)
             BEGIN
			   --
			   -- PV
			   --
				UPDATE RODLPR
				SET SITUAC='F'
					,USUATU = @P_USUARIO + '(T)'
					,DATATU = GETDATE() 
				WHERE CODFIL = @CODIGOFILIAL
				  AND CODLPR = @PV;
				--
				-- COMPOSIÇÃO DE CARGA DA PV
				--
				UPDATE RODILP
				SET SITUAC='F'
					,USUATU = @P_USUARIO + '(T)' 
					,DATATU = GETDATE() 
				WHERE FILLPR = @CODIGOFILIAL
				  AND CODLPR = @PV;
				--	
		    END
		 ELSE
		   BEGIN
		      CLOSE CURSOR_PV;
		      DEALLOCATE CURSOR_PV;
		      SET @ERR_MESSAGE = 'NÃO PERMITIDO FINALIZAR A VIAGEM, POIS EXISTE MANIFESTO NÃO BAIXADO';
			  RAISERROR (@ERR_MESSAGE, 11,1);
		   END

		FETCH NEXT FROM CURSOR_PV INTO 
			  @NUMEROPEDIDO,
			  @CODIGOFILIAL, 
			  @PV;		  

		END;

		CLOSE CURSOR_PV;
		DEALLOCATE CURSOR_PV;

		COMMIT;
		--
		SET @P_RETORNO = 'OK'

		RETURN;
		--
	END TRY
	--
	BEGIN CATCH
        SELECT   
        ERROR_NUMBER() AS ERRORNUMBER,  
        ERROR_SEVERITY() AS ERRORSEVERITY,  
        ERROR_STATE() AS ERRORSTATE,  
        ERROR_PROCEDURE() AS ERRORPROCEDURE,  
        ERROR_MESSAGE() AS ERRORMESSAGE,  
        ERROR_LINE() AS ERRORLINE;
	    SET @P_RETORNO = @ERR_MESSAGE + ERROR_MESSAGE();
		ROLLBACK;
	    RETURN;
	END CATCH
	
END
GO
