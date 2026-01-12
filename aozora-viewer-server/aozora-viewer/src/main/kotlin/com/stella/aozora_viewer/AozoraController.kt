package com.stella.aozora_viewer

import org.jsoup.Jsoup
import org.springframework.core.io.ClassPathResource
import org.springframework.core.io.Resource
import org.springframework.core.io.ResourceLoader
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class AozoraController {
    @GetMapping("/")
    fun retrieveIndex(@RequestParam(required = false) path: String): String {
        val raw = Jsoup.connect(path).get()
        raw.outputSettings().charset("Shift_JIS")


        return raw.select("body").html()
    }

    @GetMapping("/viewer")
    fun viewer() : String {
        val resourcePath = "static/viewer.html"
        val resource = ClassPathResource(resourcePath)
        return resource.inputStream.bufferedReader().readText()
    }
}