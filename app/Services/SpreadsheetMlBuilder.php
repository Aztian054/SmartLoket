<?php

namespace App\Services;

/**
 * SpreadsheetMlBuilder — generator file Excel (.xls) berformat SpreadsheetML 2003.
 *
 * Tidak memerlukan dependency eksternal; output berupa XML Office Excel yang
 * valid dan terbuka langsung di Microsoft Excel / WPS / LibreOffice.
 */
class SpreadsheetMlBuilder
{
    /**
     * @param  array<int,string>  $headers
     * @param  array<int,array<int,mixed>>  $rows
     * @param  array<int,array{text:string,style:string}>  $kop  blok kop surat (merged rows) di atas header tabel
     */
    public static function build(string $sheetName, array $headers, array $rows, array $kop = []): string
    {
        $sheet = preg_replace('/[\x00-\x1F\x7F]/', '', $sheetName) ?? 'Sheet1';

        $xml = "<?xml version=\"1.0\"?>\n";
        $xml .= "<?mso-application progid=\"Excel.Sheet\"?>\n";
        $xml .= '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"'
            .' xmlns:o="urn:schemas-microsoft-com:office:office"'
            .' xmlns:x="urn:schemas-microsoft-com:office:excel"'
            .' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"'
            ." xmlns:html=\"http://www.w3.org/TR/REC-html40\">\n";
        $xml .= " <Styles>\n";
        $xml .= '  <Style ss:ID="Default" ss:Name="Normal"><Alignment ss:Vertical="Center"/></Style>'."\n";
        $xml .= '  <Style ss:ID="kop-i"><Font ss:Bold="1" ss:Size="10"/><Alignment ss:Horizontal="Center" ss:Vertical="Center"/></Style>'."\n";
        $xml .= '  <Style ss:ID="kop-k"><Font ss:Bold="1" ss:Size="13"/><Alignment ss:Horizontal="Center" ss:Vertical="Center"/></Style>'."\n";
        $xml .= '  <Style ss:ID="kop-a"><Font ss:Size="9"/><Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/></Style>'."\n";
        $xml .= '  <Style ss:ID="kop-s"><Font ss:Bold="1" ss:Size="11" ss:Color="#0B2239"/><Alignment ss:Horizontal="Center" ss:Vertical="Center"/></Style>'."\n";
        $xml .= '  <Style ss:ID="Header"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#0B2239" ss:Pattern="Solid"/></Style>'."\n";
        $xml .= " </Styles>\n";
        $xml .= ' <Worksheet ss:Name="'.self::xmlAttr($sheet)."\">\n";
        $xml .= "  <Table>\n";

        foreach ($headers as $idx => $header) {
            $xml .= '   <Column ss:AutoFitWidth="1" ss:Width="'.(14 + (strlen((string) $header) / 2) * 4).'"/>'."\n";
        }

        // Kop surat (identitas kantor) sebagai baris-judul merger di atas tabel.
        $mergeAcross = max(0, count($headers) - 1);
        foreach ($kop as $line) {
            $text = $line['text'] ?? '';
            $style = $line['style'] ?? 'kop-i';
            $height = $style === 'kop-a' ? 26 : 18;
            $xml .= "   <Row ss:Height=\"{$height}\">";
            $xml .= '<Cell ss:MergeAcross="'.$mergeAcross.'" ss:StyleID="'.self::xmlAttr($style).'">';
            $xml .= '<Data ss:Type="String">'.self::xmlText($text).'</Data>';
            $xml .= "</Cell></Row>\n";
        }
        if ($kop !== []) {
            $xml .= "   <Row ss:Height=\"8\"/>\n";
        }

        // Header row.
        $xml .= "   <Row ss:Height=\"22\">\n";
        foreach ($headers as $header) {
            $xml .= '    <Cell ss:StyleID="Header"><Data ss:Type="String">'.self::xmlText($header)."</Data></Cell>\n";
        }
        $xml .= "   </Row>\n";

        // Data rows.
        foreach ($rows as $rowIndex => $row) {
            $xml .= "   <Row>\n";
            foreach ($row as $cell) {
                if ($cell === null || $cell === '') {
                    $xml .= "    <Cell><Data ss:Type=\"String\"></Data></Cell>\n";

                    continue;
                }

                if (is_numeric($cell) && ! str_starts_with((string) $cell, '0')) {
                    $xml .= '    <Cell><Data ss:Type="Number">'.(float) $cell."</Data></Cell>\n";
                } else {
                    $xml .= '    <Cell><Data ss:Type="String">'.self::xmlText((string) $cell)."</Data></Cell>\n";
                }
            }
            $xml .= "   </Row>\n";
        }

        $xml .= "  </Table>\n";
        $xml .= " </Worksheet>\n";
        $xml .= "</Workbook>\n";

        return $xml;
    }

    protected static function xmlText(string $value): string
    {
        $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', '', $value) ?? $value;

        return htmlspecialchars($value, ENT_XML1 | ENT_QUOTES, 'UTF-8');
    }

    protected static function xmlAttr(string $value): string
    {
        return self::xmlText($value);
    }
}
