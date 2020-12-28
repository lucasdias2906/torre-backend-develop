USE [db_visual_mirassol_teste]
GO

/****** Object:  StoredProcedure [dbo].[PI_GERA_PV_PC_AGRUPADA]    Script Date: 29/06/2020 20:48:36 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =====================================================
CREATE PROCEDURE [dbo].[PI_GERA_PV_PC_AGRUPADA]
                 @CODFIL smallint,
				 @CODIGO VARCHAR(30),
                 @CODMO1 smallint,
                 @CODMO2 smallint,
                 @PLACA  varchar(8),
                 @PLACA2 varchar(8),
                 @PLACA3 varchar(8),
                 @PLACA4 varchar(8),
				 @DATSAI smalldatetime,
                 @USUARIO varchar(20),
				 @CODLPR int output,
				 @RETORNO nvarchar(500) output
AS
BEGIN
    -- Retorno do cursor
	DECLARE 
	        @CODIGO_PC INT,
		    @PV INT,
			@err_message VARCHAR(500),
			@RET VARCHAR(500);
    
	--
    -- Retornar as PCs com base no ORDCOM (campo agrupador do informado)
	DECLARE PEDIDO CURSOR FOR   
	SELECT
	  DISTINCT PRC.CODIGO AS "CODIGO_PC" -- TABELA IPR PODE POSSUIR MAIS DE UM PRODUTO/DESTINO
	FROM RODIPR IPR
	INNER JOIN RODPRC PRC ON PRC.CODFIL = IPR.CODFIL
	                     AND PRC.CODIGO = IPR.CODIGO              
	WHERE IPR.CODFIL = @CODFIL
	  AND ISNULL(IPR.ORDCOM,'x') = @CODIGO -- Código Agrupador informado
	  AND PRC.CODTOM IN (125,148,149,151,152,154,155,157); -- TOMADOR JOHN DEERER
	--
	-- FAZ A CAMADA A PROCEDURE DE INCLUSA E/OU ATUALIZACAO 
	-- A CADA PC RECUPERADA
	--
	BEGIN TRY
	  print 'PI_GERA_PROGRAMACAO_VEICULO_PC_AGRUPADA iniciou';
	  print 'ABRIR CURSOR';
	  SET @err_message = 'ABRIR CURSOR';
	  --
	  OPEN PEDIDO; 
 	  --
	  SET @err_message = 'FECH CURSOR';
	  --
	  print 'FETCH CURSOR';
	  FETCH NEXT FROM PEDIDO   
	  INTO 
	     @CODIGO_PC;
      --
	  WHILE @@FETCH_STATUS = 0  
	  --
	  BEGIN
		--
		-- CHAMANDO PROCESSO DE GRAVACAO DA PV 
		-- PARA CADA PC RECUPERADA COM BASE NO CODIGO AGRUPADOR
		--
		print 'PI_GERA_PROGRAMACAO_VEICULO_PC_AGRUPADA pedido:' + CAST(@CODIGO_PC AS VARCHAR(10));
	    SET @err_message = 'PI_GERA_PROGRAMACAO_VEICULO_PC_NAO_AGRUPADA:' + CAST(@CODIGO_PC AS VARCHAR(10));
		EXEC dbo.PI_GERA_PV_PC_NAO_AGRUPADA
			@CODFIL,
			@CODIGO_PC, -- CODIGO DA PC RECUPERADO COM BASE NO AGRUPADOR
			@CODIGO, -- CODIGO AGRUPADOR RECEBIDO POR PARAMETRO
			@CODMO1,
			@CODMO2,
			@PLACA,
			@PLACA2,
			@PLACA3,
			@PLACA4,
			@DATSAI,
			@USUARIO,
			@CODLPR = @PV OUTPUT,
			@RETORNO = @RET OUTPUT;
		--
		-- TRATATIVA DE ERROS NAS TRANSACOES REALIZDAS
		--
		IF isnull(@PV,0) = -1 -- OCORRERAM ERROS NA GRAVACAO ???
		   BEGIN
	         print 'PI_GERA_PROGRAMACAO_VEICULO_PC_AGRUPADA finalizou com erros';
		     -- Retorno ao chamador
		     SET @CODLPR = (SELECT @PV);
		     SET @RETORNO = (SELECT @RET);
	         CLOSE PEDIDO;  
	         DEALLOCATE PEDIDO;
		     RETURN;
		   END;
		ELSE
		   BEGIN
           --
		   -- PROXIMA PC DO PEDIDO AGRUPADO
 	       --
	       SET @err_message = 'FECH CURSOR';
		   FETCH NEXT FROM PEDIDO 
		   INTO @CODIGO_PC;	
           print 'Proximo pedido:' + cast(@CODIGO_PC as varchar(10));
		   END;
	  END;
 	  --
	  SET @err_message = 'CLOSE CURSOR';
	  --
	  print 'PI_GERA_PROGRAMACAO_VEICULO_PC_AGRUPADA finalizou com sucesso';
	  --
	  CLOSE PEDIDO;  
	  DEALLOCATE PEDIDO;
	  -- Retorno ao chamador
	  SET @CODLPR = (SELECT @PV);
	  SET @RETORNO = (SELECT @RET);
	  RETURN;
	  --
	END TRY
	-- TRATATIVA DE ERROS
	BEGIN CATCH
        SELECT   
        ERROR_NUMBER() AS ErrorNumber,  
        ERROR_SEVERITY() AS ErrorSeverity,  
        ERROR_STATE() AS ErrorState,  
        ERROR_PROCEDURE() AS ErrorProcedure,  
        ERROR_MESSAGE() AS ErrorMessage,  
        ERROR_LINE() AS ErrorLine;
	    --
	    CLOSE PEDIDO;  
	    DEALLOCATE PEDIDO;
	    SET @CODLPR = -1;
	    SET @RETORNO = @err_message + ' ERRO:' + ERROR_MESSAGE();
	    print 'PI_GERA_PROGRAMACAO_VEICULO_PC_AGRUPADA finalizou com erros';
		return;
	END CATCH
	
END;
GO


