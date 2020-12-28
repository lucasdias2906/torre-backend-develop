USE [db_visual_mirassol_teste]
GO

/****** Object:  StoredProcedure [dbo].[PI_GERA_PV_PC_NAO_AGRUPADA]    Script Date: 29/06/2020 20:49:40 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- ====================================================
-- Create date: 11/03/2020
-- Description:	Criação da programação de veículo
-- Parametros de entrada: Codigo da filial do pedido,
-- numero do pedido (codigo da RODPRC), 
-- codigo do destino (considerando que pode ser N destino para uma PC),
-- codigo do motorista, placa(s) do veiculo(s) sendo a chave
-- tabela RODVEI e o usuario do Rodopar
-- 
-- Parametro de Saida: codigo da programação do veículo
-- =====================================================
CREATE PROCEDURE [dbo].[PI_GERA_PV_PC_NAO_AGRUPADA]
                 @CODFIL smallint,
				 @CODIGO int,
				 @ORDCOM VARCHAR(30),
                 @CODMO1 smallint,
                 @CODMO2 smallint,
                 @PLACA  varchar(8),
                 @PLACA2 varchar(8),
                 @PLACA3 varchar(8),
                 @PLACA4 varchar(8),
				 @DATDAI SMALLDATETIME,
                 @USUARIO varchar(20),
				 @CODLPR int output,
				 @RETORNO nvarchar(500) output
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET XACT_ABORT ON;
	
    -- ***************************************************************
	-- Recuperar informações da programação de carga (RODPRC)
	-- com base na filial e codigo do pedido informado por parametro
	-- a fim de verificar o status do pedido se não esta baixao e/ou cancelado
	-- O pedido deve possuir composição de carga/destino informado
    -- ***************************************************************
    DECLARE @err_message nvarchar(250),
	        @SITUAC_PC char,
			@CODDES INT,
			@QTDDES smallint;
	--
	BEGIN TRY
	    print 'PI_GERA_PROGRAMACAO_VEICULO_PC_NAO_AGRUPADA iniciou'
		--
		SET @err_message = 'VERIFICANDO DADOS DO PEDIDO';
         --
		SELECT
		   @SITUAC_PC = PRC.SITUAC
		FROM RODPRC PRC
		WHERE PRC.CODFIL = @CODFIL
		AND PRC.CODIGO = @CODIGO;
        -- 
		-- Veficação se foi informada a composição de carga para a PC
	    -- Recupera o codigo do destino para gravar na PV
	   SELECT 
	     	@CODDES = D.CODDES,
	   		@QTDDES = COUNT(*)
	    FROM 
	 	  (
	 	    SELECT 
	 		  DISTINCT(IPR.CODDES) CODDES
	  	    FROM RODIPR IPR
	  	    WHERE IPR.CODFIL = @CODFIL
		  	  AND IPR.CODIGO = @CODIGO		
		  ) D
		  GROUP BY D.CODDES;
        -- Consistencias no pedido
		SET @err_message = (SELECT
							CASE WHEN ISNULL(@SITUAC_PC,'X') = 'X' THEN 'PEDIDO INEXISTENTE'
								 WHEN ISNULL(@SITUAC_PC,'X') NOT IN ('D', 'M', 'B')  THEN 'PEDIDO NÃO PERMITE ALOCAÇÃO status:' + @SITUAC_PC
							     WHEN ISNULL(@CODDES,-1) = -1 THEN 'PEDIDO SEM COMPOSIÇÃO DE CARGA/DESTINO'
							     WHEN ISNULL(@QTDDES, 0) > 1 THEN 'PEDIDO COM MAIS DE UM DESTINO PC:' + cast(@CODIGO as varchar(10))
								 WHEN ISNULL(@SITUAC_PC,'X') IN ('D', 'M', 'B')  THEN 'OK'
							END AS MENSAGEM);
	   --
	   IF @err_message <> 'OK'
		  BEGIN
	 	    print 'DESVIO ERRO DE PEDIDOS'
	        RAISERROR (@err_message, 11,1);
		  END;
	   --
	END TRY
	BEGIN CATCH
	    SET @CODLPR = -1;
	    SET @RETORNO = @err_message;
	    print 'PI_GERA_PROGRAMACAO_VEICULO_PC_NAO_AGRUPADA finalizou com erros de parametros'
	    RETURN;
	END CATCH
	--
	-- VERIFICAR SE JÁ EXISTE PV GRAVADA
	-- REFERENTE A PC-PROGRAMAÇÃO DE ENTRADA  INFORMADA
	--
	BEGIN TRY
		--
        DECLARE @SITUACPV char,
		        @CODPV INT;
		--
        -- Verifica na associativa se existe a PV associada a PV
		--
		SET @err_message = 'VERIFICANDO DADOS DA PV';
		--
        SELECT 
            @CODPV = DPR.CODDOC,
			@SITUACPV = LPR.SITUAC
        FROM RODDPR DPR 
		INNER JOIN RODLPR LPR ON LPR.CODFIL = DPR.FILDOC 
		                     AND LPR.CODLPR = DPR.CODDOC
        WHERE DPR.TIPDOC = 'V' 
          AND DPR.TIPPRO = 'C' 
          AND DPR.FILPRO = @CODFIL
          AND DPR.CODPRO = @CODIGO;
        --
		SET @err_message = (SELECT
							CASE WHEN ISNULL(@SITUACPV, 'X') = 'X' -- PV INEXISTENTE (ALOCAÇÃO)
							      AND ISNULL(@SITUAC_PC,'X') NOT IN ('D', 'M')  THEN 'PC NÃO ESTA COM STATUS DE CADASTRADA/MOVIMENTADA PC=' + CAST(@CODIGO AS VARCHAR(10))  + ' STATUS=' + @SITUAC_PC 
								  --
							     WHEN ISNULL(@SITUACPV, 'X') = 'X' THEN 'OK PV INEXISTENTE'
								 WHEN ISNULL(@SITUACPV, 'X') NOT IN ('D', 'M')  THEN 'PV NÃO ESTA COM STATUS DE CADASTRADA/MOVIMENTADA PV=' + CAST(@CODPV AS VARCHAR(10)) + ' STATUS=' + @SITUACPV
								 WHEN ISNULL(@SITUACPV, 'X') IN ('D', 'M')  THEN 'OK ATUALIZAR PV'
							END AS MENSAGEM)
	   --
	   IF @err_message NOT LIKE 'OK%' -- Com erros de regra de negócio
		   BEGIN
		     RAISERROR (@err_message, 11,1);
		   END;
	   ELSE
	       BEGIN
		     PRINT @err_message;
		   END;
	END TRY
	BEGIN CATCH
	   SET @CODLPR = -1;
	   SET @RETORNO = @err_message;
	   print 'PI_GERA_PROGRAMACAO_VEICULO_PC_NAO_AGRUPADA finalizou com erros de regras na PV';
	   RETURN;
	END CATCH
	--
	-- FAZ A CAMADA A PROCEDURE DE INCLUSA E/OU ATUALIZACAO
	--
	BEGIN TRY
	    DECLARE @RET VARCHAR(500),
		        @PV INT;
		--
	    IF @err_message = 'OK PV INEXISTENTE'
			BEGIN
		    SET @err_message = 'ACIONANDO INCLUSAO';
			EXEC dbo.PI_GERA_PV_INCLUSAO 
					 @CODFIL,
					 @CODIGO, -- CODIGO DA PC
					 @ORDCOM, -- CODIGO DO AGRUPADOR INFORMADO
					 @CODDES,
					 @CODMO1,
					 @CODMO2,
					 @PLACA,
					 @PLACA2,
					 @PLACA3,
					 @PLACA4,
					 @DATDAI,
					 @USUARIO,
				     @CODLPR = @PV OUTPUT,
				     @RETORNO = @RET OUTPUT;
					 --PRINT 'INCLUSAO:' + CAST(@PV AS VARCHAR(10)) + @RET;
		             --
		             -- Devolvendo o retorno da inclusaão/atualização
		             --
		             SET @CODLPR = (SELECT @PV);
		             SET @RETORNO = (SELECT @RET);
					 print 'PI_GERA_PROGRAMACAO_VEICULO_PC_NAO_AGRUPADA finalizou com sucesso';
                     RETURN;
			END
	    ELSE
		    BEGIN
		    SET @err_message = 'ACIONANDO ATUALIZACAÇÃO';
			EXEC dbo.PI_GERA_PV_ATUALIZACAO
					 @CODFIL,
					 @CODIGO,
					 @CODMO1,
					 @CODMO2,
					 @PLACA,
					 @PLACA2,
					 @PLACA3,
					 @PLACA4,
					 @DATDAI,
					 @USUARIO,
				     @CODLPR = @PV OUTPUT,
				     @RETORNO = @RET OUTPUT;
					 --PRINT 'ATUALIZAÇÃO:' + CAST(@PV AS VARCHAR(10)) + @RET;
		             --
		             -- Devolvendo o retorno da inclusaão/atualização
		             --
		             SET @CODLPR = (SELECT @PV);
		             SET @RETORNO = (SELECT @RET);
					 print 'PI_GERA_PROGRAMACAO_VEICULO_PC_NAO_AGRUPADA finalizou com sucesso';
                     RETURN;
		    END;
		--
	END TRY
	BEGIN CATCH
        SELECT   
        ERROR_NUMBER() AS ErrorNumber,  
        ERROR_SEVERITY() AS ErrorSeverity,  
        ERROR_STATE() AS ErrorState,  
        ERROR_PROCEDURE() AS ErrorProcedure,  
        ERROR_MESSAGE() AS ErrorMessage,  
        ERROR_LINE() AS ErrorLine;
	    --
	    SET @CODLPR = -1;
	    SET @RETORNO = @err_message + ' ERRO:' + ERROR_MESSAGE();
        print 'PI_GERA_PROGRAMACAO_VEICULO_PC_NAO_AGRUPADA finalizou com erros';
		return;
	END CATCH
	
END
GO


